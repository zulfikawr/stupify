"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSpotify } from "@/components/spotify-provider";
import type { PlaylistsResponse } from "@/types/spotify";
import { Play } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function PlaylistList() {
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
    return <div className="h-80 animate-pulse bg-zinc-800 rounded-md" />;
  }

  if (!playlists?.items.length) {
    return <div className="text-zinc-400">No playlists found</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-zinc-800">
          <TableHead className="w-12 text-zinc-400">#</TableHead>
          <TableHead className="text-zinc-400">Title</TableHead>
          <TableHead className="text-zinc-400">Owner</TableHead>
          <TableHead className="text-zinc-400">Tracks</TableHead>
          <TableHead className="text-zinc-400">Collaborative</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {playlists.items.map((playlist, index) => (
          <TableRow
            key={playlist.id}
            className="group border-b border-zinc-800 hover:bg-zinc-800/50"
          >
            <TableCell className="text-zinc-400">
              <div className="flex items-center">
                <span className="group-hover:hidden">{index + 1}</span>
                <Play className="h-4 w-4 hidden group-hover:block" />
              </div>
            </TableCell>
            <TableCell>
              <Link
                href={`/playlist/${playlist.id}`}
                className="flex items-center gap-3"
              >
                <div className="relative h-10 w-10 overflow-hidden">
                  <Image
                    src={playlist.images[0]?.url || "/placeholder.svg"}
                    alt={playlist.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="font-medium text-white">{playlist.name}</div>
              </Link>
            </TableCell>
            <TableCell className="text-zinc-400">
              {playlist.owner.display_name}
            </TableCell>
            <TableCell className="text-zinc-400">
              {playlist.tracks.total}
            </TableCell>
            <TableCell className="text-zinc-400">
              {playlist.collaborative ? "Yes" : "No"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
