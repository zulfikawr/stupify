import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchView } from "@/components/views/search-view";

export default function SearchPage() {
  return (
    <ScrollArea className="flex-1 bg-gradient-to-b from-zinc-800 to-black">
      <div className="p-6">
        <SearchView />
      </div>
    </ScrollArea>
  );
}
