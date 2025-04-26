"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSpotify } from "@/components/spotify-provider";
import type { PlaylistResponse } from "@/types/spotify";
import { formatDuration } from "@/lib/utils";

interface PlaylistViewProps {
  playlistId?: string;
}

export function PlaylistView({ playlistId }: PlaylistViewProps) {
  const { client } = useSpotify();
  const [playlist, setPlaylist] = useState<PlaylistResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (client && playlistId) {
      setIsLoading(true);
      client
        .getPlaylist(playlistId)
        .then((data) => {
          setPlaylist(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch playlist:", err);
          setIsLoading(false);
        });
    }
  }, [client, playlistId]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-end gap-6">
          <div className="h-60 w-60 animate-pulse bg-zinc-800" />
          <div className="space-y-3">
            <div className="h-4 w-20 animate-pulse bg-zinc-800" />
            <div className="h-8 w-60 animate-pulse bg-zinc-800" />
            <div className="h-4 w-40 animate-pulse bg-zinc-800" />
          </div>
        </div>
        <div className="h-80 animate-pulse bg-zinc-800/50 rounded-md" />
      </div>
    );
  }

  if (!playlist) {
    return <div className="text-zinc-400">Playlist not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end gap-6">
        <div className="relative h-60 w-60 overflow-hidden shadow-lg">
          <Image
            src={playlist.images[0]?.url || "/placeholder.svg"}
            alt={playlist.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <div className="text-sm font-medium uppercase text-zinc-400">
            Playlist
          </div>
          <h1 className="text-5xl font-bold text-white">{playlist.name}</h1>
          <div className="mt-2 text-sm text-zinc-400">
            <span>{playlist.owner.display_name}</span>
            <span className="mx-1">•</span>
            <span>{playlist.tracks.total} songs</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Button className="rounded-full bg-green-500 hover:bg-green-600 text-black">
          <Play className="mr-2 h-4 w-4 fill-black" />
          Play
        </Button>

        <Table>
          <TableHeader>
            <TableRow className="border-b border-zinc-800">
              <TableHead className="w-12 text-zinc-400">#</TableHead>
              <TableHead className="text-zinc-400">Title</TableHead>
              <TableHead className="text-zinc-400">Album</TableHead>
              <TableHead className="text-zinc-400">Date added</TableHead>
              <TableHead className="text-right text-zinc-400">
                Duration
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {playlist.tracks.items.map((item, index) => (
              <TableRow
                key={item.track.id}
                className="border-b border-zinc-800 hover:bg-zinc-800/50"
              >
                <TableCell className="text-zinc-400">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden">
                      <Image
                        src={
                          item.track.album.images[0]?.url || "/placeholder.svg"
                        }
                        alt={item.track.album.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        {item.track.name}
                      </div>
                      <div className="text-sm text-zinc-400">
                        {item.track.artists.map((a) => a.name).join(", ")}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-zinc-400">
                  {item.track.album.name}
                </TableCell>
                <TableCell className="text-zinc-400">
                  {new Date(item.added_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right text-zinc-400">
                  {formatDuration(item.track.duration_ms)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
