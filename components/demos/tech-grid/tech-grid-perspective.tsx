import { TechGrid } from "@/components/dusk/techy/tech-grid";

export default function TechGridPerspective() {
  return (
    <div className="relative flex h-80 w-full items-start justify-center overflow-hidden rounded-xl border border-white/10 bg-background pt-14">
      <TechGrid variant="perspective" />
      <div className="relative text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">v2.0</p>
        <h3 className="mt-2 text-3xl font-semibold tracking-tight text-white">Into the grid</h3>
      </div>
    </div>
  );
}
