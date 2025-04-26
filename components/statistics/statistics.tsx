import { TopArtists } from "@/components/statistics/top-artists";
import { TopTracks } from "@/components/statistics/top-tracks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Statistics() {
  return (
    <Tabs defaultValue="artists">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Statistics</h2>
        <TabsList className="bg-zinc-800 grid grid-cols-2 md:flex md:w-fit">
          <TabsTrigger value="artists">Top Artists</TabsTrigger>
          <TabsTrigger value="tracks">Top Tracks</TabsTrigger>
        </TabsList>
      </div>
      <div className="mt-4">
        <TabsContent value="artists">
          <TopArtists />
        </TabsContent>
        <TabsContent value="tracks">
          <TopTracks />
        </TabsContent>
      </div>
    </Tabs>
  )
}