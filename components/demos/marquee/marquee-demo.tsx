import { Atom, Boxes, Cloud, Hexagon, InfinityIcon, Orbit, Rocket, Triangle, Waves, Zap } from "lucide-react";

import { Marquee } from "@/components/dusk/marquee/marquee";

const brands = [
  { name: "Nebula", icon: Orbit },
  { name: "Quanta", icon: Atom },
  { name: "Lumen", icon: Zap },
  { name: "Vertex", icon: Triangle },
  { name: "Stratus", icon: Cloud },
  { name: "Hexa", icon: Hexagon },
  { name: "Tidal", icon: Waves },
  { name: "Cubic", icon: Boxes },
  { name: "Ascent", icon: Rocket },
  { name: "Loopwise", icon: InfinityIcon },
];

function Logo({ name, icon: Icon }: (typeof brands)[number]) {
  return (
    <div className="flex items-center gap-2 px-4 text-white/50 transition-colors hover:text-white">
      <Icon aria-hidden className="size-5" />
      <span className="text-lg font-semibold tracking-tight">{name}</span>
    </div>
  );
}

export default function MarqueeDemo() {
  return (
    <section aria-label="Trusted by" className="w-full max-w-2xl space-y-4">
      <p className="text-center text-sm text-muted-foreground">Used by product teams at</p>
      <Marquee speed={36} gap={24}>
        {brands.map((brand) => (
          <Logo key={brand.name} {...brand} />
        ))}
      </Marquee>
      <Marquee direction="right" speed={28} gap={24}>
        {[...brands].reverse().map((brand) => (
          <Logo key={brand.name} {...brand} />
        ))}
      </Marquee>
    </section>
  );
}
