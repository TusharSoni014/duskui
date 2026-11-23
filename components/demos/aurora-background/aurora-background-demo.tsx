import { Button } from "@/components/ui/button";
import { AuroraBackground } from "@/components/dusk/backgrounds/aurora-background";

export default function AuroraBackgroundDemo() {
  return (
    <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-background">
      <AuroraBackground />
      <div className="relative px-6 text-center">
        <h3 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Deploy previews for every branch</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/60">
          Every push gets its own URL, so reviewers can try changes before they merge.
        </p>
        <Button className="mt-5">Get started</Button>
      </div>
    </div>
  );
}
