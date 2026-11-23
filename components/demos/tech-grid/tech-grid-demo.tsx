import { Button } from "@/components/ui/button";
import { TechGrid } from "@/components/dusk/techy/tech-grid";

export default function TechGridDemo() {
  return (
    <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-background">
      <TechGrid />
      <div className="relative px-6 text-center">
        <h3 className="text-3xl font-semibold tracking-tight text-white">Infrastructure as code</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/60">Describe your stack in one file and preview every change.</p>
        <Button className="mt-4" size="sm" variant="outline">
          Read the docs
        </Button>
      </div>
    </div>
  );
}
