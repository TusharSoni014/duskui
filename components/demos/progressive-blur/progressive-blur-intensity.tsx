import { ProgressiveBlur } from "@/components/dusk/progressive-blur/progressive-blur";

const levels = [
  { blurIntensity: 4, height: "40%" },
  { blurIntensity: 12, height: "55%" },
  { blurIntensity: 32, height: "70%" },
];

const text =
  "Night falls over the city as signs flicker on one by one, painting wet streets in mint, violet and amber.";

export default function ProgressiveBlurIntensity() {
  return (
    <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-3">
      {levels.map((level) => (
        <div
          key={level.blurIntensity}
          className="relative h-56 overflow-hidden rounded-xl border border-white/10 bg-card p-4"
        >
          <p className="text-sm leading-relaxed text-white/85">
            {text} {text}
          </p>
          <ProgressiveBlur position="bottom" blurIntensity={level.blurIntensity} height={level.height} />
          <code className="absolute bottom-3 left-4 z-20 font-mono text-[11px] text-white">
            blurIntensity={level.blurIntensity}
          </code>
        </div>
      ))}
    </div>
  );
}
