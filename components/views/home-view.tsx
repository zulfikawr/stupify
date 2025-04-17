"use client";

import { useSession } from "next-auth/react";
import { NowPlaying } from "@/components/now-playing/now-playing";
import { RecentlyPlayed } from "@/components/history/recently-played";
import { TopArtists } from "@/components/top-statistics/top-artists";
import { TopTracks } from "@/components/top-statistics/top-tracks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function HomeView() {
  const { data: session } = useSession();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Good {getTimeOfDay()}, {session?.user?.name?.split(" ")[0]}
        </h1>
      </div>

      <NowPlaying />

      <div>
        <h2 className="mb-4 text-2xl font-bold text-white">Recently Played</h2>
        <RecentlyPlayed />
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-bold text-white">Statistics</h2>
        <Tabs defaultValue="artists">
          <TabsList className="bg-zinc-800 grid grid-cols-2 md:flex md:w-fit">
            <TabsTrigger value="artists">Top Artists</TabsTrigger>
            <TabsTrigger value="tracks">Top Tracks</TabsTrigger>
          </TabsList>
          <TabsContent value="artists">
            <TopArtists />
          </TabsContent>
          <TabsContent value="tracks">
            <TopTracks />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}
