"use client";

import { useEffect, useState } from "react";
import { useSpotify } from "@/components/spotify-provider";
import type { PlaylistsResponse } from "@/types/spotify";

export function usePlaylistsData() {
  const { client } = useSpotify();
  const [playlists, setPlaylists] = useState<PlaylistsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!client) return;

    const fetchPlaylists = async () => {
      try {
        const data = await client.getUserPlaylists(50);
        setPlaylists(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch playlists:", error);
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, [client]);

  return { playlists: playlists?.items, isLoading };
}
