import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Account, User } from "next-auth";
import type { Session } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { saveTokensToFirebase } from "@/lib/firebase";
import { getServerSession } from "next-auth/next";
import { refreshAccessToken } from "./spotify-client";

// Define the types for the callback parameters
interface SpotifyToken extends JWT {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

interface SpotifyAccount {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface SpotifyUser {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface SpotifySession extends Session {
  accessToken?: string;
  refreshToken?: string;
  error?: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

const scopes = [
  "user-read-private",
  "user-read-email",
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-read-recently-played",
  "user-top-read",
  "playlist-read-private",
  "playlist-read-collaborative",
].join(" ");

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      authorization: {
        params: { scope: scopes },
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      account,
      user,
    }: {
      token: JWT;
      account?: Account | null;
      user?: User;
    }): Promise<JWT> {
      const spotifyAccount = account as SpotifyAccount;
      const spotifyUser = user as SpotifyUser;

      // Initial sign in
      if (spotifyAccount && spotifyUser) {
        console.log("JWT callback - initial sign in", {
          userId: spotifyUser.id,
        });

        if (spotifyAccount.access_token && spotifyAccount.refresh_token) {
          try {
            await saveTokensToFirebase(
              spotifyUser.id,
              spotifyAccount.access_token,
              spotifyAccount.refresh_token,
              spotifyAccount.expires_at || 0,
            );
            console.log("Tokens saved to Firebase successfully");
          } catch (error) {
            console.error("Error saving tokens to Firebase:", error);
          }
        }

        return {
          ...token,
          accessToken: spotifyAccount.access_token,
          refreshToken: spotifyAccount.refresh_token,
          accessTokenExpires: spotifyAccount.expires_at * 1000, // Spotify gives seconds
          user: {
            id: spotifyUser.id,
            name: spotifyUser.name,
            email: spotifyUser.email,
            image: spotifyUser.image,
          },
        };
      }

      // Token still valid
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Token expired — refresh it
      console.log("JWT callback - token expired, refreshing");
      const refreshed = await refreshAccessToken(token.refreshToken as string);

      if (!refreshed) {
        return {
          ...token,
          error: "RefreshAccessTokenError",
        };
      }

      return {
        ...token,
        accessToken: refreshed.accessToken,
        accessTokenExpires: refreshed.accessTokenExpires,
        refreshToken: refreshed.refreshToken,
      };
    },

    async session({
      session,
      token,
    }: {
      session: SpotifySession;
      token: SpotifyToken;
    }) {
      if (token) {
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        if (token.user) {
          session.user = token.user;
        }
        if (typeof token.error === "string") {
          session.error = token.error;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth-error", // Add an error page
  },
  session: {
    strategy: "jwt",
  },
  debug: true, // Enable debug mode to see more detailed errors
};

// Export a function that can be used to get the session on the server
export const auth = () => getServerSession(authOptions);
