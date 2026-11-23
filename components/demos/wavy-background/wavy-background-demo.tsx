import { Button } from "@/components/ui/button";
import { WavyBackground } from "@/components/dusk/wavy-background/wavy-background";

export default function WavyBackgroundDemo() {
  return (
    <div className="relative flex h-96 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-background">
      <WavyBackground />
      <div className="relative px-6 text-center">
        <h3 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">Data pipelines</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/70">Move data between your warehouse and apps on a schedule.</p>
        <Button className="mt-5">Create a pipeline</Button>
      </div>
    </div>
  );
}
