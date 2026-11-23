import { Marquee } from "@/components/dusk/marquee/marquee";

const columns = [
  ["Realtime sync", "Edge cache", "Zero config", "Type-safe", "Dark mode"],
  ["Spring physics", "Layout animations", "Reduced motion", "SSR safe", "Tree-shakable"],
  ["Copy & paste", "Tailwind v4", "shadcn/ui", "Accessible", "Open source"],
];

function Tag({ children }: { children: string }) {
  return (
    <span className="block rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-sm text-white/70">
      {children}
    </span>
  );
}

export default function MarqueeVerticalDemo() {
  return (
    <div className="grid h-72 w-full max-w-lg grid-cols-3 gap-3">
      {columns.map((tags, i) => (
        <Marquee key={i} direction={i % 2 ? "down" : "up"} speed={18 + i * 6} gap={12} className="h-full">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Marquee>
      ))}
    </div>
  );
}
