import { Button } from "@/components/ui/button";
import { BackgroundBeams } from "@/components/dusk/backgrounds/background-beams";

export default function BackgroundBeamsCta() {
  return (
    <div className="relative flex h-80 w-full items-center overflow-hidden rounded-xl border border-white/10 bg-background p-8">
      <BackgroundBeams count={12} pathOpacity={0} fade={false} />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <div className="relative max-w-sm">
        <h3 className="text-2xl font-semibold tracking-tight text-white">Ready when you are</h3>
        <p className="mt-2 text-sm text-white/60">
          With <code className="font-mono text-white/80">pathOpacity=0</code> only the moving beams show, and a gradient
          scrim keeps the copy readable.
        </p>
        <div className="mt-5 flex gap-2">
          <Button>Start free</Button>
          <Button variant="outline">Talk to sales</Button>
        </div>
      </div>
    </div>
  );
}
