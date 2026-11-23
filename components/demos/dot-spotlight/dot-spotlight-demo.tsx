import { DotSpotlight } from "@/components/dusk/backgrounds/dot-spotlight";

export default function DotSpotlightDemo() {
  return (
    <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-background">
      <DotSpotlight />
      <div className="relative px-6 text-center">
        <h3 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Find slow requests faster</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/60">Traces, logs and metrics for every endpoint, in one view.</p>
      </div>
    </div>
  );
}
