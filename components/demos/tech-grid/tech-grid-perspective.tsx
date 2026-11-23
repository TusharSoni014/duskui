import { TechGrid } from "@/components/dusk/techy/tech-grid";

export default function TechGridPerspective() {
  return (
    <div className="relative flex h-80 w-full items-start justify-center overflow-hidden rounded-xl border border-white/10 bg-background pt-14">
      <TechGrid variant="perspective" />
      <div className="relative text-center">
        <h3 className="text-3xl font-semibold tracking-tight text-white">Version 2.0 is here</h3>
        <p className="mt-2 text-sm text-white/60">Faster builds and a new CLI.</p>
      </div>
    </div>
  );
}
