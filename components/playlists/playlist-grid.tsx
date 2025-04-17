"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSpotify } from "@/components/spotify-provider";
import type { PlaylistsResponse } from "@/types/spotify";
import { Play } from "lucide-react";

export function PlaylistGrid() {
  const { client } = useSpotify();
  const [playlists, setPlaylists] = useState<PlaylistsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (client) {
      setIsLoading(true);
      client
        .getUserPlaylists(50)
        .then((data) => {
          setPlaylists(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch playlists:", err);
          setIsLoading(false);
        });
    }
  }, [client]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-square animate-pulse bg-zinc-800 rounded-md" />
            <div className="h-4 w-3/4 animate-pulse bg-zinc-800 rounded-md" />
            <div className="h-3 w-1/2 animate-pulse bg-zinc-800 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (!playlists?.items.length) {
    return <div className="text-zinc-400">No playlists found</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {playlists.items.map((playlist) => (
        <Link
          key={playlist.id}
          href={`/playlist/${playlist.id}`}
          className="group"
        >
          <div className="relative aspect-square overflow-hidden rounded-md bg-zinc-800">
            <Image
              src={playlist.images[0]?.url || "/placeholder.svg"}
              alt={playlist.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
            <button className="absolute right-2 bottom-2 rounded-full bg-green-500 p-3 text-black opacity-0 transition-opacity group-hover:opacity-100">
              <Play className="h-4 w-4 fill-black" />
            </button>
            {playlist.collaborative && (
              <div className="absolute top-2 left-2 rounded-full bg-white px-2 py-0.5 text-xs font-medium text-black">
                Collaborative
              </div>
            )}
          </div>
          <div className="mt-2">
            <div className="font-medium text-white truncate">
              {playlist.name}
            </div>
            <div className="text-sm text-zinc-400 truncate">
              By {playlist.owner.display_name} • {playlist.tracks.total} tracks
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
