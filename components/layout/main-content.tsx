"use client";

import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HomeView } from "@/components/views/home-view";
import { SearchView } from "@/components/views/search-view";
import { LibraryView } from "@/components/views/library-view";
import { PlaylistView } from "@/components/views/playlist-view";

export function MainContent() {
  const pathname = usePathname();

  const renderContent = () => {
    if (pathname === "/") {
      return <HomeView />;
    }

    if (pathname === "/search") {
      return <SearchView />;
    }

    if (pathname === "/library") {
      return <LibraryView />;
    }

    if (pathname.startsWith("/playlist/")) {
      const playlistId = pathname.split("/").pop();
      return <PlaylistView playlistId={playlistId} />;
    }

    return <HomeView />;
  };

  return (
    <ScrollArea className="flex-1 bg-gradient-to-b from-zinc-800 to-black">
      <div className="p-6">{renderContent()}</div>
    </ScrollArea>
  );
}
