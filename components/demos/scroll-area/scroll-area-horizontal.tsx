import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const works = [
  { title: "Northern Ridge", hue: 160 },
  { title: "Glass Harbor", hue: 190 },
  { title: "Moss Line", hue: 135 },
  { title: "Low Tide", hue: 210 },
  { title: "Ember Field", hue: 40 },
  { title: "Night Garden", hue: 280 },
];

export default function ScrollAreaHorizontalDemo() {
  return (
    <ScrollArea className="w-full max-w-md rounded-xl border bg-card/40 whitespace-nowrap">
      <div className="flex w-max gap-3 p-4">
        {works.map((work) => (
          <figure key={work.title} className="shrink-0">
            <div
              className="h-36 w-28 rounded-lg border"
              style={{
                background: `radial-gradient(120% 90% at 20% 0%, oklch(0.7 0.15 ${work.hue} / 0.6), transparent 60%), linear-gradient(160deg, oklch(0.25 0.05 ${work.hue}), oklch(0.12 0.03 ${work.hue}))`,
              }}
            />
            <figcaption className="pt-2 text-xs text-muted-foreground">{work.title}</figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
