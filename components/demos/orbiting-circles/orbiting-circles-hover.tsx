import { OrbitingCircles } from "@/components/dusk/orbiting-circles/orbiting-circles";

const people = [
  { initials: "AK", name: "Ana K.", hue: "from-emerald-400 to-teal-500" },
  { initials: "JS", name: "Jon S.", hue: "from-sky-400 to-indigo-500" },
  { initials: "MR", name: "Mia R.", hue: "from-fuchsia-400 to-pink-500" },
  { initials: "TO", name: "Tom O.", hue: "from-amber-300 to-orange-500" },
  { initials: "LV", name: "Lea V.", hue: "from-violet-400 to-purple-500" },
  { initials: "DN", name: "Dev N.", hue: "from-lime-300 to-green-500" },
];

export default function OrbitingCirclesHover() {
  return (
    <div className="relative flex h-80 w-full items-center justify-center overflow-hidden">
      <div className="relative z-10 text-center">
        <p className="text-3xl font-semibold tabular-nums text-white">2,400+</p>
        <p className="text-xs text-white/60">teams on board</p>
      </div>
      <OrbitingCircles radius={115} duration={24} iconSize={44} pauseOnHover pathClassName="border-dashed border-white/15">
        {people.map((p) => (
          <button
            key={p.initials}
            type="button"
            aria-label={`${p.name}'s profile`}
            className={`flex size-full items-center justify-center rounded-full bg-gradient-to-br ${p.hue} text-xs font-semibold text-black/80 ring-2 ring-background transition-transform outline-none hover:scale-110 focus-visible:ring-primary motion-reduce:transition-none`}
          >
            {p.initials}
          </button>
        ))}
      </OrbitingCircles>
    </div>
  );
}
