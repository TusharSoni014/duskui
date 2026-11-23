import { ProgressiveBlur } from "@/components/dusk/progressive-blur/progressive-blur";

export default function ProgressiveBlurCard() {
  return (
    <article className="relative h-80 w-full max-w-xs overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(160deg,oklch(0.5_0.05_230),oklch(0.22_0.03_260))]">
      <ProgressiveBlur position="bottom" height="55%" blurIntensity={24} tint="rgb(0 0 0 / 0.45)" />
      <div className="absolute inset-x-0 bottom-0 z-20 p-5">
        <p className="text-xs text-white/70">Collection</p>
        <h3 className="mt-1 text-xl font-semibold text-white">Aurora Studies</h3>
        <p className="mt-1 text-sm text-white/75">Twelve long exposures shot above the Arctic Circle.</p>
      </div>
    </article>
  );
}
