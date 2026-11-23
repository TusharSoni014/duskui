import { ProgressiveBlur } from "@/components/dusk/progressive-blur/progressive-blur";

export default function ProgressiveBlurCard() {
  return (
    <article className="relative h-80 w-full max-w-xs overflow-hidden rounded-2xl border border-white/10 bg-[conic-gradient(from_200deg_at_30%_40%,#0ea5e9,var(--color-primary),#a855f7,#f43f5e,#0ea5e9)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgb(255_255_255/0.35),transparent_40%)]" />
      <ProgressiveBlur position="bottom" height="55%" blurIntensity={24} tint="rgb(0 0 0 / 0.45)" />
      <div className="absolute inset-x-0 bottom-0 z-20 p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/70">Collection</p>
        <h3 className="mt-1 text-xl font-semibold text-white">Aurora Studies</h3>
        <p className="mt-1 text-sm text-white/75">Twelve long exposures shot above the Arctic Circle.</p>
      </div>
    </article>
  );
}
