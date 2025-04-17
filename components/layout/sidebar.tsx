"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Home, Search, Library, Plus, Heart } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { usePlaylistsData } from "@/hooks/use-playlists-data";

export function Sidebar() {
  const pathname = usePathname();
  const { playlists, isLoading } = usePlaylistsData();

  return (
    <div className="hidden md:flex h-full w-60 flex-col bg-zinc-900 text-zinc-400">
      <div className="p-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-white"
        >
          <svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor">
            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.669 11.538a.498.498 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686zm.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858zm.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288z" />
          </svg>
          <span>Spotify</span>
        </Link>
      </div>
      <nav className="space-y-1 px-3">
        <Link
          href="/"
          className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
            pathname === "/"
              ? "bg-zinc-800 text-white"
              : "hover:bg-zinc-800 hover:text-white"
          }`}
        >
          <Home className="h-5 w-5" />
          Home
        </Link>
        <Link
          href="/search"
          className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
            pathname === "/search"
              ? "bg-zinc-800 text-white"
              : "hover:bg-zinc-800 hover:text-white"
          }`}
        >
          <Search className="h-5 w-5" />
          Search
        </Link>
        <Link
          href="/library"
          className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
            pathname === "/library"
              ? "bg-zinc-800 text-white"
              : "hover:bg-zinc-800 hover:text-white"
          }`}
        >
          <Library className="h-5 w-5" />
          Your Library
        </Link>
      </nav>
      <div className="mt-6 px-3">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Playlist
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <Heart className="mr-2 h-4 w-4" />
            Liked Songs
          </Button>
        </div>
      </div>
      <Separator className="my-4 bg-zinc-800" />
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 pb-4">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-full animate-pulse rounded-md bg-zinc-800"
                />
              ))
            : playlists?.map((playlist) => (
                <Link
                  key={playlist.id}
                  href={`/playlist/${playlist.id}`}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-zinc-800 hover:text-white"
                >
                  <div className="flex-shrink-0">
                    {playlist.images?.length > 0 ? (
                      <Image
                        src={playlist.images[0].url}
                        alt={playlist.name}
                        width={128}
                        height={128}
                        className="h-10 w-10 rounded-sm object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-sm bg-zinc-700 flex items-center justify-center">
                        <Library className="h-5 w-5 text-zinc-400" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{playlist.name}</p>
                    <p className="truncate text-xs text-zinc-400">
                      {playlist.description ||
                        `By ${playlist.owner.display_name || "Spotify"}`}
                    </p>
                  </div>
                </Link>
              ))}
        </div>
      </ScrollArea>
    </div>
  );
}
