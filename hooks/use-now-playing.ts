"use client";

import { useEffect, useState } from "react";
import { useSpotify } from "@/components/spotify-provider";
import type { CurrentlyPlayingResponse } from "@/types/spotify";

export function useNowPlaying() {
  const { client } = useSpotify();
  const [currentTrack, setCurrentTrack] =
    useState<CurrentlyPlayingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!client) {
      setIsLoading(false);
      return;
    }

    const fetchNowPlaying = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await client.getCurrentlyPlaying();

        // Handle null response (no content)
        if (data === null) {
          setCurrentTrack(null);
          setIsLoading(false);
          return;
        }

        // Check if data is valid and contains a track
        if (data && data.item) {
          setCurrentTrack(data);
        } else {
          setCurrentTrack(null);
        }
      } catch (error) {
        console.error("Failed to fetch currently playing:", error);
        setError("Failed to fetch currently playing track");
        setCurrentTrack(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNowPlaying();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchNowPlaying, 30000);

    return () => clearInterval(interval);
  }, [client]);

  return {
    currentTrack,
    isLoading,
    error,
    isPlaying: currentTrack?.is_playing ?? false,
  };
}
