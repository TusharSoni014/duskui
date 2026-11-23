import { ProgressiveBlur } from "@/components/dusk/progressive-blur/progressive-blur";

const hues = [160, 300, 40, 220, 150, 20, 320, 190];

export default function ProgressiveBlurGallery() {
  return (
    <div className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-background">
      <div
        role="region"
        tabIndex={0}
        aria-label="Gallery, scroll sideways"
        className="flex gap-3 overflow-x-auto overscroll-x-contain px-16 py-5 outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/50"
      >
        {hues.map((hue, i) => (
          <figure key={hue} className="shrink-0">
            <div className="h-40 w-32 rounded-lg" style={{ background: `oklch(0.32 0.04 ${hue})` }} />
            <figcaption className="mt-2 text-xs text-white/50">Frame {String(i + 1).padStart(2, "0")}</figcaption>
          </figure>
        ))}
      </div>
      <ProgressiveBlur position="left" height={80} blurIntensity={8} />
      <ProgressiveBlur position="right" height={80} blurIntensity={8} />
    </div>
  );
}
