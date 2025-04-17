"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Heart,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Shuffle,
  Volume2,
  Laptop,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import type { CurrentlyPlayingResponse } from "@/types/spotify";
import { formatDuration } from "@/lib/utils";

interface PlayerProps {
  currentTrack: CurrentlyPlayingResponse | null;
  isLoading: boolean;
}

export function Player({ currentTrack, isLoading }: PlayerProps) {
  const [isPlaying, setIsPlaying] = useState(currentTrack?.is_playing || false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, we would call the Spotify API to toggle playback
  };

  const progress = currentTrack?.progress_ms || 0;
  const duration = currentTrack?.item?.duration_ms || 0;
  const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="flex h-20 items-center justify-between border-t border-zinc-800 bg-zinc-900 px-4">
      {/* Now playing info */}
      <div className="flex w-1/3 items-center gap-4">
        {isLoading ? (
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 animate-pulse bg-zinc-800" />
            <div className="space-y-2">
              <div className="h-4 w-32 animate-pulse bg-zinc-800" />
              <div className="h-3 w-24 animate-pulse bg-zinc-800" />
            </div>
          </div>
        ) : currentTrack?.item ? (
          <>
            <div className="relative h-14 w-14 overflow-hidden rounded-md">
              <Image
                src={
                  currentTrack.item.album.images[0]?.url || "/placeholder.svg"
                }
                alt={currentTrack.item.album.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-medium text-white">
                {currentTrack.item.name}
              </div>
              <div className="text-xs text-zinc-400">
                {currentTrack.item.artists.map((a) => a.name).join(", ")}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="text-sm text-zinc-400">Not playing</div>
        )}
      </div>

      {/* Playback controls */}
      <div className="flex w-1/3 flex-col items-center gap-2">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-white"
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-white"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white text-black hover:bg-white/90 hover:scale-105 transition"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4 ml-0.5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-white"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-white"
          >
            <Repeat className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex w-full items-center gap-2">
          <div className="text-xs text-zinc-400 w-10 text-right">
            {formatDuration(progress)}
          </div>
          <Slider
            value={[progressPercentage]}
            max={100}
            step={0.1}
            className="w-full"
          />
          <div className="text-xs text-zinc-400 w-10">
            {formatDuration(duration)}
          </div>
        </div>
      </div>

      {/* Volume controls */}
      <div className="flex w-1/3 items-center justify-end gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-400 hover:text-white"
        >
          <Laptop className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-zinc-400" />
          <Slider defaultValue={[70]} max={100} step={1} className="w-24" />
        </div>
      </div>
    </div>
  );
}
