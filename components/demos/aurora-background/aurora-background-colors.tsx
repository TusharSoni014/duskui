import { AuroraBackground } from "@/components/dusk/backgrounds/aurora-background";

const palettes = [
  { label: "Sunset", colors: ["#f472b6", "#fb923c", "#a78bfa"] },
  { label: "Glacier", colors: ["#38bdf8", "#e0f2fe", "#6366f1", "#22d3ee"] },
];

export default function AuroraBackgroundColors() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {palettes.map((palette) => (
        <div
          key={palette.label}
          className="relative flex h-56 items-end overflow-hidden rounded-xl border border-white/10 bg-background p-4"
        >
          <AuroraBackground colors={palette.colors} intensity={0.7} />
          <div className="relative">
            <p className="text-sm font-medium text-white">{palette.label}</p>
            <p className="font-mono text-xs text-white/60">{palette.colors.length} colors</p>
          </div>
        </div>
      ))}
    </div>
  );
}
