"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSpotify } from "@/components/spotify-provider";
import type { TopTracksResponse } from "@/types/spotify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Play } from "lucide-react";
import { formatDuration } from "@/lib/utils";

type TimeRange = "short_term" | "medium_term" | "long_term";

export function TopTracks() {
  const { client } = useSpotify();
  const [topTracks, setTopTracks] = useState<TopTracksResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("medium_term");

  useEffect(() => {
    if (client) {
      setIsLoading(true);
      client
        .getTopTracks({ time_range: timeRange, limit: 10 })
        .then((data) => {
          setTopTracks(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch top tracks:", err);
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
        <div className="h-80 animate-pulse bg-zinc-800 rounded-md" />
      </div>
    );
  }

  if (!topTracks?.items.length) {
    return <div className="text-zinc-400">No top tracks data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Your Top Tracks</h3>
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

      <Table>
        <TableHeader>
          <TableRow className="border-b border-zinc-800">
            <TableHead className="w-12 text-zinc-400">#</TableHead>
            <TableHead className="text-zinc-400">Title</TableHead>
            <TableHead className="text-zinc-400">Album</TableHead>
            <TableHead className="text-right text-zinc-400">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topTracks.items.map((track, index) => (
            <TableRow
              key={track.id}
              className="group border-b border-zinc-800 hover:bg-zinc-800/50"
            >
              <TableCell className="text-zinc-400">
                <div className="flex items-center">
                  <span className="group-hover:hidden">{index + 1}</span>
                  <Play className="h-4 w-4 hidden group-hover:block" />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden">
                    <Image
                      src={track.album.images[0]?.url || "/placeholder.svg"}
                      alt={track.album.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-white">{track.name}</div>
                    <div className="text-sm text-zinc-400">
                      {track.artists.map((a) => a.name).join(", ")}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-zinc-400">
                {track.album.name}
              </TableCell>
              <TableCell className="text-right text-zinc-400">
                {formatDuration(track.duration_ms)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
