import { FlickeringGrid } from "@/components/dusk/flickering-grid/flickering-grid";

const grids = [
  { label: "squareSize={2} gap={4}", props: { squareSize: 2, gap: 4, color: "#7dd3fc", maxOpacity: 0.3, seed: 4 } },
  { label: "squareSize={8} gap={3}", props: { squareSize: 8, gap: 3, seed: 9 } },
];

export default function FlickeringGridColors() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {grids.map((grid) => (
        <div
          key={grid.label}
          className="relative flex h-56 items-end overflow-hidden rounded-xl border border-white/10 bg-background p-4"
        >
          <FlickeringGrid {...grid.props} />
          <span className="relative rounded bg-background/80 px-1.5 py-0.5 font-mono text-xs text-white/70">
            {grid.label}
          </span>
        </div>
      ))}
    </div>
  );
}
