import { GlassCard } from "@/components/dusk/glass/glass-card";
import { GlassBackdrop } from "@/components/demos/glass-card/glass-backdrop";

const levels = [
  { blur: 4, label: "Light", tint: undefined },
  { blur: 14, label: "Frosted", tint: undefined },
  { blur: 28, label: "Milky", tint: "rgb(255 255 255 / 0.1)" },
];

export default function GlassCardBlur() {
  return (
    <>
      <GlassBackdrop />
      <div className="relative grid w-full max-w-2xl gap-4 sm:grid-cols-3">
        {levels.map((level) => (
          <GlassCard key={level.blur} blur={level.blur} tint={level.tint} className="p-5">
            <p className="text-sm font-semibold">{level.label}</p>
            <p className="mt-1 text-xs text-white/70">blur={level.blur}</p>
            <p className="mt-6 text-sm leading-relaxed text-white/80">
              Higher blur hides more of what sits behind the card.
            </p>
          </GlassCard>
        ))}
      </div>
    </>
  );
}
