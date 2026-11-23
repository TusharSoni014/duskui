import { BackgroundBeams } from "@/components/dusk/backgrounds/background-beams";

const variants = [
  { label: 'color="#a5b4fc" count={16}', props: { color: "#a5b4fc", count: 16, seed: 4 } },
  { label: 'color="#e5e5e5" speed={1.5}', props: { color: "#e5e5e5", speed: 1.5, count: 8, seed: 9 } },
];

export default function BackgroundBeamsCustom() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {variants.map((variant) => (
        <div
          key={variant.label}
          className="relative flex h-56 items-end overflow-hidden rounded-xl border border-white/10 bg-background p-4"
        >
          <BackgroundBeams {...variant.props} />
          <span className="relative font-mono text-xs text-white/70">{variant.label}</span>
        </div>
      ))}
    </div>
  );
}
