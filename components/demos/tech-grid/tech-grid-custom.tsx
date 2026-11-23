import { TechGrid } from "@/components/dusk/techy/tech-grid";

export default function TechGridCustom() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <div className="relative flex h-56 items-end overflow-hidden rounded-xl border border-white/10 bg-background p-4">
        <TechGrid color="#f472b6" cellSize={24} radius={110} scanLine={false} />
        <span className="relative font-mono text-xs text-white/70">cellSize=24 · no scan line</span>
      </div>
      <div className="relative flex h-56 items-end overflow-hidden rounded-xl border border-white/10 bg-background p-4">
        <TechGrid variant="perspective" color="#a78bfa" cellSize={28} speed={2} />
        <span className="relative font-mono text-xs text-white/70">perspective · speed=2</span>
      </div>
    </div>
  );
}
