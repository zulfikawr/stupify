"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSpotify } from "@/components/spotify-provider";
import type { TopArtistsResponse } from "@/types/spotify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TimeRange = "short_term" | "medium_term" | "long_term";

export function TopArtists() {
  const { client } = useSpotify();
  const [topArtists, setTopArtists] = useState<TopArtistsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("medium_term");

  useEffect(() => {
    if (client) {
      setIsLoading(true);
      client
        .getTopArtists({ time_range: timeRange, limit: 10 })
        .then((data) => {
          setTopArtists(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch top artists:", err);
          setIsLoading(false);
        });
    }
  }, [client, timeRange]);

  const timeRangeLabels = {
    short_term: "Last 4 Weeks",
    medium_term: "Last 6 Months",
    long_term: "All Time",
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-40 animate-pulse bg-zinc-800 rounded-md" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-square animate-pulse bg-zinc-800 rounded-full" />
              <div className="h-4 w-3/4 animate-pulse bg-zinc-800 rounded-md mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!topArtists?.items.length) {
    return <div className="text-zinc-400">No top artists data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Your Top Artists</h3>
        <Select
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as TimeRange)}
        >
          <SelectTrigger className="w-40 bg-zinc-800 border-zinc-700">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="short_term">
              {timeRangeLabels.short_term}
            </SelectItem>
            <SelectItem value="medium_term">
              {timeRangeLabels.medium_term}
            </SelectItem>
            <SelectItem value="long_term">
              {timeRangeLabels.long_term}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {topArtists.items.slice(0, 10).map((artist) => (
          <div key={artist.id} className="text-center">
            <div className="relative mx-auto aspect-square w-full max-w-[160px] overflow-hidden rounded-full">
              <Image
                src={artist.images[0]?.url || "/placeholder.svg"}
                alt={artist.name}
                width={512}
                height={512}
                className="object-cover"
              />
            </div>
            <div className="mt-2 font-medium text-white truncate">
              {artist.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
