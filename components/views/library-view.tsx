"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";
import { PlaylistGrid } from "@/components/playlists/playlist-grid";
import { PlaylistList } from "@/components/playlists/playlist-list";

export function LibraryView() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Your Library</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={viewMode === "list" ? "text-white" : "text-zinc-400"}
            onClick={() => setViewMode("list")}
          >
            <List className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={viewMode === "grid" ? "text-white" : "text-zinc-400"}
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? <PlaylistGrid /> : <PlaylistList />}
    </div>
  );
}
