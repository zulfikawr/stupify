"use client";

import { useSession } from "next-auth/react";
import { MainContent } from "@/components/layout/main-content";

export default function Dashboard() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return <MainContent />;
}
