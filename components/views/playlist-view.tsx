"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Clock, Play } from "lucide-react";
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
import { formatDuration, truncateText } from "@/lib/utils";
import Link from "next/link";

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
          setPlaylist(null);
          setIsLoading(false);
        });
    } else if (!playlistId) {
      setPlaylist(null);
      setIsLoading(false);
    }
  }, [client, playlistId]);

  const handleRowClick = (url: string | undefined) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6">
          <div className="h-40 w-40 md:h-60 md:w-60 animate-pulse bg-zinc-800 rounded flex-shrink-0" />
          <div className="space-y-3 w-full md:w-auto flex flex-col items-center md:items-start">
            <div className="h-4 w-20 animate-pulse bg-zinc-800 rounded" />
            <div className="h-8 w-48 md:w-60 animate-pulse bg-zinc-800 rounded" />
            <div className="h-4 w-full max-w-sm md:max-w-md animate-pulse bg-zinc-800 rounded" />
            <div className="h-4 w-32 md:w-40 animate-pulse bg-zinc-800 rounded" />
          </div>
        </div>
        <div className="flex justify-end md:justify-start">
          <div className="h-12 w-32 animate-pulse bg-zinc-800 rounded-full" />
        </div>
        <div className="h-80 animate-pulse bg-zinc-800/50 rounded-md" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="text-zinc-400 text-center">
        Could not load playlist details.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6">
        <div className="relative h-40 w-40 md:h-60 md:w-60 overflow-hidden shadow-lg rounded flex-shrink-0">
          <Image
            src={playlist.images?.[0]?.url || "/placeholder.svg"}
            alt={
              playlist.name ? `${playlist.name} playlist cover` : "Playlist cover"
            }
            fill
            sizes="(max-width: 768px) 160px, 240px"
            className="object-cover"
            priority={true}
          />
        </div>
        <div className="flex flex-col items-center md:items-start text-center md:text-left mt-4 md:mt-0">
          <div className="text-xs md:text-sm font-medium uppercase text-zinc-400 tracking-wider">
            Playlist
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-1 line-clamp-2">
            {playlist.name}
          </h1>
          {playlist.description && (
            <p
              className="text-sm text-zinc-400 mt-3 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: playlist.description }}
            />
          )}
          <div className="mt-3 text-xs md:text-sm text-zinc-400">
            <span>{playlist.owner.display_name || "Spotify"}</span>
            <span className="mx-1">•</span>
            <span>
              {playlist.tracks.total}{" "}
              {playlist.tracks.total === 1 ? "song" : "songs"}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-end md:justify-start">
          {playlist.external_urls?.spotify && (
            <Link href={playlist.external_urls.spotify} passHref target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="rounded-full bg-green-500 hover:bg-green-600 text-black px-8 py-3"
              >
                <Play className="mr-2 h-5 w-5 fill-black" />
                Play
              </Button>
            </Link>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-b border-zinc-700 hover:bg-transparent">
              <TableHead className="hidden md:table-cell md:w-12 text-center text-zinc-400 font-semibold">
                #
              </TableHead>
              <TableHead className="text-zinc-400 font-semibold">
                Title
              </TableHead>
              <TableHead className="hidden md:table-cell text-zinc-400 font-semibold">
                Album
              </TableHead>
              <TableHead className="text-right text-zinc-400 font-semibold pr-4 md:pr-6">
                <Clock className="inline-block h-4 w-4" />
                <span className="sr-only">Duration</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {playlist.tracks.items.map((item, index) =>
              item?.track && item.track.external_urls?.spotify ? (
                <TableRow
                  key={item.track.id || index}
                  className="border-b border-zinc-800 hover:bg-zinc-800/50 cursor-pointer group"
                  onClick={() => handleRowClick(item.track.external_urls.spotify)}
                >
                  <TableCell className="hidden md:table-cell md:w-12 text-center align-middle text-zinc-400 group-hover:text-white">
                    {index + 1}
                  </TableCell>
                  <TableCell className="py-2 pr-1 md:pr-2">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded flex-shrink-0">
                        {item.track.album.images?.[0]?.url ? (
                          <Image
                            src={item.track.album.images[0].url}
                            alt={item.track.album.name || "Album cover"}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-zinc-700 flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-zinc-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <div
                          className="font-medium text-white group-hover:text-green-400 truncate max-w-[200px] md:max-w-[300px]"
                          title={item.track.name}
                        >
                          {truncateText(item.track.name, 40)}
                        </div>
                        <div className="text-xs md:text-sm text-zinc-400 truncate">
                          {truncateText(item.track.artists.map((a) => a.name).join(", "), 40)}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell align-middle text-zinc-400 truncate">
                    {truncateText(item.track.album.name, 40)}
                  </TableCell>
                  <TableCell className="text-right align-middle text-zinc-400 text-sm pr-4 md:pr-6">
                    {formatDuration(item.track.duration_ms)}
                  </TableCell>
                </TableRow>
              ) : null
            )}
          </TableBody>
        </Table>
        {playlist.tracks.items.length === 0 && !isLoading && (
          <div className="text-center text-zinc-400 py-8">
            This playlist is empty.
          </div>
        )}
      </div>
    </div>
  );
}