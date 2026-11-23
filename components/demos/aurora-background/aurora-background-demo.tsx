import { Button } from "@/components/ui/button";
import { AuroraBackground } from "@/components/dusk/backgrounds/aurora-background";

export default function AuroraBackgroundDemo() {
  return (
    <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-background">
      <AuroraBackground />
      <div className="relative px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Now in beta</p>
        <h3 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Ship under the northern lights</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-white/60">
          A calm, living backdrop for heroes, auth screens and launch pages.
        </p>
        <Button className="mt-5">Get started</Button>
      </div>
    </div>
  );
}
