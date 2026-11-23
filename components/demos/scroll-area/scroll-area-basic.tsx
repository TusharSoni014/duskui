import { ScrollArea } from "@/components/ui/scroll-area";

const releases = Array.from({ length: 40 }, (_, i) => `v2.${40 - i}.0`);

export default function ScrollAreaBasicDemo() {
  return (
    <ScrollArea className="h-72 w-52 rounded-xl border bg-card/40">
      <div className="p-4">
        <h4 className="mb-3 text-sm font-medium">Releases</h4>
        {releases.map((release) => (
          <div key={release} className="border-b py-2 text-sm text-muted-foreground last:border-0">
            {release}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
