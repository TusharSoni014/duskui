import { OrbitingCircles } from "@/components/dusk/orbiting-circles/orbiting-circles";

const people = [
  { initials: "AK", name: "Ana K." },
  { initials: "JS", name: "Jon S." },
  { initials: "MR", name: "Mia R." },
  { initials: "TO", name: "Tom O." },
  { initials: "LV", name: "Lea V." },
  { initials: "DN", name: "Dev N." },
];

export default function OrbitingCirclesHover() {
  return (
    <div className="relative flex h-80 w-full items-center justify-center overflow-hidden">
      <div className="relative z-10 text-center">
        <p className="text-sm font-medium text-foreground">Design team</p>
        <p className="text-xs text-muted-foreground">6 members</p>
      </div>
      <OrbitingCircles radius={115} duration={24} iconSize={44} pauseOnHover pathClassName="border-dashed">
        {people.map((p) => (
          <button
            key={p.initials}
            type="button"
            aria-label={`${p.name}'s profile`}
            className="flex size-full items-center justify-center rounded-full border bg-muted text-xs font-medium text-foreground outline-none transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {p.initials}
          </button>
        ))}
      </OrbitingCircles>
    </div>
  );
}
