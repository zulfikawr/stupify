import { ScrollArea } from "@/components/ui/scroll-area";
import { LibraryView } from "@/components/views/library-view";

export default function PlaylistPage() {
  return (
    <ScrollArea className="flex-1 bg-gradient-to-b from-zinc-800 to-black">
      <div className="p-6">
        <LibraryView />
      </div>
    </ScrollArea>
  );
}
