import { Button } from "@/components/ui/button";
import { RetroGrid } from "@/components/dusk/retro-grid/retro-grid";

export default function RetroGridDemo() {
  return (
    <div className="relative flex h-96 w-full flex-col items-center overflow-hidden rounded-xl border border-white/10 bg-background">
      <RetroGrid />
      <div className="relative px-6 pt-10 text-center">
        <h3 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Game jam 2026</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/60">48 hours, one theme, any engine. Teams of up to four.</p>
        <Button className="mt-5">Register</Button>
      </div>
    </div>
  );
}
