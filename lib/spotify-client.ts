import type {
  CurrentlyPlayingResponse,
  RecentlyPlayedResponse,
  TopItemsResponse,
  PlaylistsResponse,
  PlaylistResponse,
  TimeRangeOptions,
  TopTracksResponse,
  SpotifyTrack,
  SpotifyArtist,
  TopArtistsResponse,
} from "@/types/spotify";
import { saveTokensToFirebase, getTokensFromFirebase } from "@/lib/firebase";
import { SpotifyUser } from "./auth";

export class SpotifyClient {
  private accessToken: string;
  private refreshToken: string;
  private userId: string;
  private baseUrl = "https://api.spotify.com/v1";
  private clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  private clientSecret = process.env.SPOTIFY_CLIENT_SECRET; // Server-side only

  constructor(accessToken: string, refreshToken: string, userId: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.userId = userId;
  }

  private async refreshAccessToken(): Promise<void> {
    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: this.refreshToken,
        }),
      });

      const responseBody = await response.text();

      if (!response.ok) {
        console.error("Failed to refresh token response body:", responseBody);
        throw new Error(
          `Failed to refresh token: ${response.status} ${response.statusText}`,
        );
      }

      const data = JSON.parse(responseBody);
      this.accessToken = data.access_token;
      const expiresAt = Date.now() + data.expires_in * 1000;

      await saveTokensToFirebase(
        this.userId,
        this.accessToken,
        this.refreshToken,
        expiresAt,
      );
    } catch (error) {
      console.error("Error refreshing access token:", error);
      throw new Error("REFRESH_TOKEN_FAILED");
    }
  }

  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      // Handle 204 No Content responses (common for currently-playing when nothing is playing)
      if (response.status === 204) {
        return null as T;
      }

      if (response.status === 401) {
        // Token expired, try to refresh
        await this.refreshAccessToken();

        // Retry the request with the new token
        const retryResponse = await fetch(url, {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${this.accessToken}`,
            ...options.headers,
          },
        });

        if (!retryResponse.ok) {
          throw new Error(
            `Spotify API error after refresh: ${retryResponse.status} ${retryResponse.statusText}`,
          );
        }

        // Handle 204 on retry as well
        if (retryResponse.status === 204) {
          return null as T;
        }

        return await retryResponse.json();
      }

      if (!response.ok) {
        throw new Error(
          `Spotify API error: ${response.status} ${response.statusText}`,
        );
      }

      // Check if response has content before parsing
      const contentLength = response.headers.get("Content-Length");
      if (contentLength === "0") {
        return null as T;
      }

      return await response.json();
    } catch (error) {
      console.error("Spotify API request failed:", error);
      throw error;
    }
  }

  // Static method to create client with tokens from Firebase
  static async create(userId: string): Promise<SpotifyClient | null> {
    const tokens = await getTokensFromFirebase(userId);
    if (!tokens) return null;

    // Check if token is expired (with 1 minute buffer)
    if (tokens.expires_at && tokens.expires_at < Date.now() - 60000) {
      // Create a temporary client to refresh tokens
      const tempClient = new SpotifyClient(
        tokens.access_token,
        tokens.refresh_token,
        userId,
      );
      try {
        await tempClient.refreshAccessToken();
        return tempClient;
      } catch (error) {
        console.error("Failed to refresh token during client creation:", error);
        return null;
      }
    }

    return new SpotifyClient(tokens.access_token, tokens.refresh_token, userId);
  }

  async getCurrentlyPlaying(): Promise<CurrentlyPlayingResponse | null> {
    try {
      const response = await this.fetch<CurrentlyPlayingResponse>(
        "/me/player/currently-playing",
      );
      return response;
    } catch (error) {
      console.error("Error in getCurrentlyPlaying:", error);
      return null;
    }
  }

  async getRecentlyPlayed(limit = 20): Promise<RecentlyPlayedResponse> {
    return this.fetch<RecentlyPlayedResponse>(
      `/me/player/recently-played?limit=${limit}`,
    );
  }

  async getTopItems(
    type: "artists" | "tracks",
    options: TimeRangeOptions = { time_range: "medium_term", limit: 20 },
  ): Promise<TopItemsResponse> {
    const { time_range, limit } = options;
    return this.fetch<TopItemsResponse>(
      `/me/top/${type}?time_range=${time_range}&limit=${limit}`,
    );
  }

  async getTopTracks(options: TimeRangeOptions): Promise<TopTracksResponse> {
    const data = await this.getTopItems("tracks", options);
    return { ...data, items: data.items as SpotifyTrack[] };
  }

  async getTopArtists(options: TimeRangeOptions): Promise<TopArtistsResponse> {
    const data = await this.getTopItems("artists", options);
    return { ...data, items: data.items as SpotifyArtist[] };
  }

  async getUserPlaylists(limit = 20): Promise<PlaylistsResponse> {
    return this.fetch<PlaylistsResponse>(`/me/playlists?limit=${limit}`);
  }

  async getPlaylist(playlistId: string): Promise<PlaylistResponse> {
    return this.fetch<PlaylistResponse>(`/playlists/${playlistId}`);
  }

  async getProfile(): Promise<SpotifyUser> {
    return this.fetch("/me");
  }
}

export async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) throw refreshedTokens;

    return {
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? refreshToken,
    };
  } catch (err) {
    console.error("Failed to refresh access token", err);
    return null;
  }
}
