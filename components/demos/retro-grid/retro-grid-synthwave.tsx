import { RetroGrid } from "@/components/dusk/retro-grid/retro-grid";

export default function RetroGridSynthwave() {
  return (
    <div className="relative flex h-96 w-full items-start justify-center overflow-hidden rounded-xl border border-white/10 bg-background">
      <RetroGrid sun color="#f9a8d4" sunColors={["#fde68a", "#fb7185"]} horizon={0.55} cellSize={64} />
      <h3 className="relative mt-8 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Night drive</h3>
    </div>
  );
}
