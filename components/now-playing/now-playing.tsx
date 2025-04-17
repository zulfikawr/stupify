"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import Image from "next/image";
import { useNowPlaying } from "@/hooks/use-now-playing";
import { useState } from "react";

export function NowPlaying() {
  const { currentTrack, isLoading } = useNowPlaying();
  const [isPlaying, setIsPlaying] = useState(currentTrack?.is_playing || false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, we would call the Spotify API to toggle playback
  };

  if (isLoading) {
    return (
      <Card className="bg-zinc-800/50 border-zinc-700">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 animate-pulse bg-zinc-700 rounded-md" />
            <div className="space-y-2">
              <div className="h-4 w-48 animate-pulse bg-zinc-700 rounded-md" />
              <div className="h-3 w-32 animate-pulse bg-zinc-700 rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentTrack?.item) {
    return (
      <Card className="bg-zinc-800/50 border-zinc-700">
        <CardContent className="p-6">
          <div className="text-zinc-400">Nothing playing right now</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-800/50 border-zinc-700 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-center">
          <div className="relative h-24 w-24 overflow-hidden">
            <Image
              src={currentTrack.item.album.images[0]?.url || "/placeholder.svg"}
              alt={currentTrack.item.album.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 p-4">
            <div className="text-lg font-medium text-white">
              {currentTrack.item.name}
            </div>
            <div className="text-sm text-zinc-400">
              {currentTrack.item.artists.map((a) => a.name).join(", ")}
            </div>
          </div>
          <div className="p-4">
            <Button
              className="rounded-full bg-white text-black hover:bg-white/90 hover:scale-105 transition"
              size="icon"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4 ml-0.5" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
