import { DotSpotlight } from "@/components/dusk/backgrounds/dot-spotlight";

export default function DotSpotlightDemo() {
  return (
    <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-background">
      <DotSpotlight />
      <div className="relative px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Observability</p>
        <h3 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Shine a light on latency</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-white/60">Hover the grid: the spotlight follows your cursor.</p>
      </div>
    </div>
  );
}
