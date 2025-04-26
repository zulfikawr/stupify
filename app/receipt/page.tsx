import { ScrollArea } from "@/components/ui/scroll-area";
import { ReceiptView } from "@/components/views/receipt-view";

export default function ReceiptPage() {
  return (
    <ScrollArea className="flex-1 bg-gradient-to-b from-zinc-800 to-black">
      <div className="p-6">
        <ReceiptView />
      </div>
    </ScrollArea>
  );
}