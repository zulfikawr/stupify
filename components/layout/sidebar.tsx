"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  Search,
  Library,
  ChevronRight,
  ChevronLeft,
  Receipt,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { usePlaylistsData } from "@/hooks/use-playlists-data";
import { truncateText } from "@/lib/utils";

export function Sidebar() {
  const { status } = useSession();
  const pathname = usePathname();
  const { playlists, isLoading } = usePlaylistsData();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (status === "unauthenticated") {
    return null;
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`hidden md:flex h-full flex-col bg-zinc-900 text-zinc-200 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-60"
      } shadow-xl`}
    >
      <div
        className={`p-4 flex ${isCollapsed ? "justify-center" : "items-center justify-between"}`}
      >
        {!isCollapsed && (
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-white"
          >
            <svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor">
              <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.669 11.538a.498.498 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686zm.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858zm.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288z" />
            </svg>
            <span className="text-lg">Spotify</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-full"
          onClick={toggleSidebar}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
      <nav className="space-y-1 px-3">
        <Link
          href="/"
          className={`flex rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            isCollapsed ? "justify-center" : ""
          } ${
            pathname === "/"
              ? "bg-zinc-700 text-white"
              : "hover:bg-zinc-700 hover:text-white"
          }`}
          title={isCollapsed ? "Home" : ""}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Home className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="truncate">Home</span>}
          </div>
        </Link>
        <Link
          href="/search"
          className={`flex rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            isCollapsed ? "justify-center" : ""
          } ${
            pathname === "/search"
              ? "bg-zinc-700 text-white"
              : "hover:bg-zinc-700 hover:text-white"
          }`}
          title={isCollapsed ? "Search" : ""}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Search className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="truncate">Search</span>}
          </div>
        </Link>
        <Link
          href="/library"
          className={`flex rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            isCollapsed ? "justify-center" : ""
          } ${
            pathname === "/library"
              ? "bg-zinc-700 text-white"
              : "hover:bg-zinc-700 hover:text-white"
          }`}
          title={isCollapsed ? "Your Library" : ""}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Library className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="truncate">Your Library</span>}
          </div>
        </Link>
        <Link
          href="/receipt"
          className={`flex rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            isCollapsed ? "justify-center" : ""
          } ${
            pathname === "/receipt"
              ? "bg-zinc-700 text-white"
              : "hover:bg-zinc-700 hover:text-white"
          }`}
          title={isCollapsed ? "Your Receipt" : ""}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Receipt className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="truncate">Your Receipt</span>}
          </div>
        </Link>
      </nav>
      <Separator className="my-4 bg-zinc-700" />
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 pb-4">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-full animate-pulse rounded-lg bg-zinc-700"
                />
              ))
            : playlists?.map((playlist) => (
                <Link
                  key={playlist.id}
                  href={`/playlist/${playlist.id}`}
                  className={`flex rounded-lg px-3 py-2 text-sm hover:bg-zinc-700 hover:text-white transition-colors ${
                    isCollapsed ? "justify-center" : ""
                  }`}
                  title={isCollapsed ? playlist.name : ""}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex-shrink-0">
                      {playlist.images?.length > 0 ? (
                        <Image
                          src={playlist.images[0].url}
                          alt={playlist.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-md object-cover shadow-sm"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-zinc-600 flex items-center justify-center">
                          <Library className="h-5 w-5 text-zinc-400" />
                        </div>
                      )}
                    </div>
                    {!isCollapsed && (
                      <div className="min-w-0">
                        <p className="truncate font-medium text-zinc-100">
                          {truncateText(playlist.name, 20)}
                        </p>
                        <p className="truncate text-xs text-zinc-400">
                          {truncateText(playlist.description, 25) ||
                            `By ${playlist.owner.display_name || "Spotify"}`}
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
        </div>
      </ScrollArea>
    </div>
  );
}