"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { PlaylistView } from "@/components/views/playlist-view";
import { usePathname } from "next/navigation";

export default function PlaylistPage() {
  const pathname = usePathname();
  const playlistId = pathname.split("/").pop();

  return (
    <ScrollArea className="flex-1 bg-gradient-to-b from-zinc-800 to-black">
      <div className="p-6">
        <PlaylistView playlistId={playlistId} />
      </div>
    </ScrollArea>
  );
}
