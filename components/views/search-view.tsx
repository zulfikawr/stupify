"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSpotify } from "@/components/spotify-provider";
import {
  SpotifySearchResponse,
  SpotifyTrack,
  SpotifyAlbum,
  SpotifyArtist,
} from "@/types/spotify";

export function SearchView() {
  const { client, isLoading: clientLoading } = useSpotify();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] =
    useState<SpotifySearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || !client) {
      setSearchResults(null);
      return;
    }

    async function performSearch() {
      if (client) {
        setIsLoading(true);
        setError(null);
        try {
          console.log("Searching for query:", query);
          const results = await client.search(query, [
            "track",
            "album",
            "artist",
          ]);
          console.log("Search results:", results);
          setSearchResults(results);
        } catch (err) {
          setError("Failed to fetch search results");
          console.error("Search error:", err);
        } finally {
          setIsLoading(false);
        }
      }
    }

    const debounce = setTimeout(performSearch, 300); // Debounce search
    return () => clearTimeout(debounce);
  }, [query, client]);

  if (clientLoading) {
    return (
      <div className="text-center text-zinc-400 py-12">
        Loading Spotify client...
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center text-zinc-400 py-12">
        <p>Please sign in to search Spotify</p>
        <a href="/login" className="text-blue-500 hover:underline">
          Sign in
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Search</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <Input
          type="search"
          placeholder="What do you want to listen to?"
          className="pl-10 bg-zinc-800 border-zinc-700 text-white"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {isLoading && <p className="text-center text-zinc-400">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!query && !searchResults && (
        <div className="text-center text-zinc-400 py-12">
          <p>Search for artists, songs, or albums</p>
        </div>
      )}

      {searchResults && (
        <div className="space-y-8">
          {/* Tracks */}
          {searchResults.tracks && searchResults.tracks.items.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Songs</h2>
              <div className="grid gap-4">
                {searchResults.tracks.items.map((track: SpotifyTrack) => (
                  <div
                    key={track.id}
                    className="flex items-center gap-4 p-2 hover:bg-zinc-700 rounded"
                  >
                    <Image
                      src={track.album.images[0]?.url || "/placeholder.png"}
                      alt={track.name}
                      className="w-12 h-12 rounded"
                      width={512}
                      height={512}
                    />
                    <div>
                      <p className="text-white font-medium">{track.name}</p>
                      <p className="text-zinc-400 text-sm">
                        {track.artists.map((artist) => artist.name).join(", ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Albums */}
          {searchResults.albums && searchResults.albums.items.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Albums</h2>
              <div className="grid gap-4">
                {searchResults.albums.items.map((album: SpotifyAlbum) => (
                  <div
                    key={album.id}
                    className="flex items-center gap-4 p-2 hover:bg-zinc-700 rounded"
                  >
                    <Image
                      src={album.images[0]?.url || "/placeholder.png"}
                      alt={album.name}
                      className="w-12 h-12 rounded"
                      width={512}
                      height={512}
                    />
                    <div>
                      <p className="text-white font-medium">{album.name}</p>
                      <p className="text-zinc-400 text-sm">
                        {album.artists.map((artist) => artist.name).join(", ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Artists */}
          {searchResults.artists && searchResults.artists.items.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Artists</h2>
              <div className="grid gap-4">
                {searchResults.artists.items.map((artist: SpotifyArtist) => (
                  <div
                    key={artist.id}
                    className="flex items-center gap-4 p-2 hover:bg-zinc-700 rounded"
                  >
                    <Image
                      src={artist.images[0]?.url || "/placeholder.png"}
                      alt={artist.name}
                      className="w-12 h-12 rounded-full"
                      width={512}
                      height={512}
                    />
                    <div>
                      <p className="text-white font-medium">{artist.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {!searchResults.tracks?.items.length &&
            !searchResults.albums?.items.length &&
            !searchResults.artists?.items.length && (
              <div className="text-center text-zinc-400 py-12">
                <p>No results found for "{query}"</p>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
