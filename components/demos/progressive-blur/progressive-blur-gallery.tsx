import { ProgressiveBlur } from "@/components/dusk/progressive-blur/progressive-blur";

const tones = [
  "from-primary/80 to-sky-500/70",
  "from-violet-500/80 to-fuchsia-500/70",
  "from-amber-400/80 to-rose-500/70",
  "from-sky-400/80 to-indigo-500/70",
  "from-emerald-400/80 to-primary/60",
  "from-rose-400/80 to-orange-400/70",
  "from-fuchsia-500/80 to-violet-600/70",
  "from-teal-400/80 to-cyan-500/70",
];

export default function ProgressiveBlurGallery() {
  return (
    <div className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-background">
      <div
        role="region"
        tabIndex={0}
        aria-label="Gallery, scroll sideways"
        className="flex gap-3 overflow-x-auto overscroll-x-contain px-16 py-5 outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/50"
      >
        {tones.map((tone, i) => (
          <figure key={tone} className="shrink-0">
            <div className={`h-40 w-32 rounded-lg bg-linear-to-br ${tone}`} />
            <figcaption className="mt-2 font-mono text-xs text-white/50">Frame {String(i + 1).padStart(2, "0")}</figcaption>
          </figure>
        ))}
      </div>
      <ProgressiveBlur position="left" height={80} blurIntensity={8} />
      <ProgressiveBlur position="right" height={80} blurIntensity={8} />
    </div>
  );
}
