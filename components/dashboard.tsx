"use client";

import { useSession } from "next-auth/react";
import { HomeView } from "./views/home-view";
import { ScrollArea } from "./ui/scroll-area";

export default function Dashboard() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <ScrollArea className="flex-1 bg-gradient-to-b from-zinc-800 to-black">
      <div className="p-6">
        <HomeView />
      </div>
    </ScrollArea>
  );
}
