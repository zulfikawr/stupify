"use client";

import { useSession } from "next-auth/react";
import { NowPlaying } from "@/components/now-playing/now-playing";
import { RecentlyPlayed } from "@/components/history/recently-played";
import { Statistics } from "@/components/statistics/statistics";

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

      <RecentlyPlayed />

      <Statistics />
    </div>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}
