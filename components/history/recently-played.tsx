"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSpotify } from "@/components/spotify-provider";
import type { RecentlyPlayedResponse } from "@/types/spotify";
import { formatTimeAgo } from "@/lib/utils";
import { Play, ChevronDown, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, isToday, isYesterday } from "date-fns";

export function RecentlyPlayed() {
  const { client } = useSpotify();
  const [recentTracks, setRecentTracks] =
    useState<RecentlyPlayedResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [visibleCount, setVisibleCount] = useState(10);
  const itemsPerPage = 10;

  useEffect(() => {
    if (client) {
      setIsLoading(true);
      client
        .getRecentlyPlayed(50)
        .then((data) => {
          setRecentTracks(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch recently played tracks:", err);
          setIsLoading(false);
        });
    }
  }, [client]);

  const filteredTracks =
    recentTracks?.items.filter((item) => {
      if (!dateFilter) return true;
      const playedDate = new Date(item.played_at);
      return playedDate.toDateString() === dateFilter.toDateString();
    }) || [];

  const getGroupName = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM d, yyyy");
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + itemsPerPage);
  };

  const clearDateFilter = () => {
    setDateFilter(undefined);
    setVisibleCount(itemsPerPage);
  };

  // Render the date picker controls
  const renderDateControls = () => (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-white">Recently Played</h2>
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-zinc-900 text-white hover:bg-zinc-800 w-10 h-10"
              title={dateFilter ? format(dateFilter, "PPP") : "Filter by date"}
            >
              <CalendarIcon className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800">
            <Calendar
              mode="single"
              selected={dateFilter}
              onSelect={setDateFilter}
              className="bg-zinc-900 text-white"
            />
          </PopoverContent>
        </Popover>

        {dateFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearDateFilter}
            className="text-zinc-400 hover:text-white"
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <>
        {renderDateControls()}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-square animate-pulse bg-zinc-800 rounded-md" />
              <div className="h-4 w-3/4 animate-pulse bg-zinc-800 rounded-md" />
              <div className="h-3 w-1/2 animate-pulse bg-zinc-800 rounded-md" />
            </div>
          ))}
        </div>
      </>
    );
  }

  if (!recentTracks?.items?.length) {
    return (
      <>
        {renderDateControls()}
        <div className="text-zinc-400">No recently played tracks</div>
      </>
    );
  }

  if (filteredTracks.length === 0) {
    return (
      <>
        {renderDateControls()}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-zinc-400 text-lg">
            {`No songs played on ${format(dateFilter!, "MMMM d, yyyy")}`}
          </div>
          <Button
            variant="ghost"
            onClick={clearDateFilter}
            className="text-green-500 hover:text-green-400"
          >
            Show all tracks
          </Button>
        </div>
      </>
    );
  }

  const groupName = dateFilter
    ? format(dateFilter, "MMMM d, yyyy")
    : getGroupName(new Date(filteredTracks[0].played_at));

  return (
    <div className="space-y-4">
      {renderDateControls()}

      <div>
        <h3 className="mb-4 text-xl font-bold text-white">{groupName}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredTracks.slice(0, visibleCount).map((item) => (
            <Link
              key={item.played_at}
              href={item.track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block"
            >
              <div className="relative aspect-square overflow-hidden rounded-md bg-zinc-800">
                <Image
                  src={item.track.album.images[0]?.url || "/placeholder.svg"}
                  alt={item.track.album.name}
                  width={512}
                  height={512}
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                <button className="absolute right-2 bottom-2 rounded-full bg-green-500 p-3 text-black opacity-0 transition-opacity group-hover:opacity-100">
                  <Play className="h-4 w-4 fill-black" />
                </button>
              </div>
              <div className="mt-2">
                <div className="font-medium text-white truncate">
                  {item.track.name}
                </div>
                <div className="text-sm text-zinc-400 truncate">
                  {item.track.artists.map((a) => a.name).join(", ")}
                </div>
                <div className="mt-1 text-xs text-zinc-500">
                  {formatTimeAgo(new Date(item.played_at))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredTracks.length > visibleCount && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="ghost"
              onClick={handleShowMore}
              className="text-green-500 hover:text-green-400"
            >
              <ChevronDown className="mr-2 h-4 w-4" />
              Show more
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}