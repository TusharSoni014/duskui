import { RetroGrid } from "@/components/dusk/retro-grid/retro-grid";

const floors = [
  { label: "angle={40} horizon={0.35}", props: { angle: 40, color: "#7dd3fc", horizon: 0.35 } },
  { label: "angle={72} cellSize={36}", props: { angle: 72, cellSize: 36, color: "#c4b5fd", speed: 0.6 } },
];

export default function RetroGridAngles() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {floors.map((floor) => (
        <div
          key={floor.label}
          className="relative flex h-60 items-start overflow-hidden rounded-xl border border-white/10 bg-background p-4"
        >
          <RetroGrid {...floor.props} />
          <span className="relative font-mono text-xs text-white/70">{floor.label}</span>
        </div>
      ))}
    </div>
  );
}
