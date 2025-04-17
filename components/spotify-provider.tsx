"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SpotifyClient } from "@/lib/spotify-client";

type SpotifyContextType = {
  client: SpotifyClient | null;
  isLoading: boolean;
};

const SpotifyContext = createContext<SpotifyContextType>({
  client: null,
  isLoading: true,
});

export function SpotifyProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [client, setClient] = useState<SpotifyClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initClient = async () => {
      if (status === "authenticated" && session?.accessToken) {
        try {
          const spotifyClient = new SpotifyClient(
            session.accessToken as string,
            session.refreshToken as string,
            session.user?.id as string,
          );

          await spotifyClient.getProfile();

          setClient(spotifyClient);
          setIsLoading(false);
        } catch (err: unknown) {
          console.error("Spotify client init failed:", err);
          if (err instanceof Error && err.message === "REFRESH_TOKEN_FAILED") {
            router.push("/login");
          } else {
            setClient(null);
            setIsLoading(false);
          }
        }
      } else if (status === "unauthenticated") {
        setClient(null);
        setIsLoading(false);
      }
    };

    initClient();
  }, [session, status, router]);

  return (
    <SpotifyContext.Provider value={{ client, isLoading }}>
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => useContext(SpotifyContext);
