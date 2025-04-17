"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchView() {
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Search</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <Input
          type="search"
          placeholder="What do you want to listen to?"
          className="pl-10 bg-zinc-800 border-zinc-700 text-white"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="text-center text-zinc-400 py-12">
        {query ? (
          <p>Search results will appear here</p>
        ) : (
          <p>Search for artists, songs, or podcasts</p>
        )}
      </div>
    </div>
  );
}
