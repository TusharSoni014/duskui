import { CustomCursor } from "@/components/dusk/custom-cursor/custom-cursor";

const tiles = [
  { title: "Night drive", label: "Play", tone: "from-violet-500/70 via-fuchsia-500/50 to-rose-400/50" },
  { title: "Field notes", label: "Read", tone: "from-primary/60 via-emerald-500/40 to-sky-500/50" },
  { title: "Lowlight", label: "View", tone: "from-amber-400/60 via-orange-500/40 to-rose-500/50" },
];

export default function CustomCursorLabels() {
  return (
    <CustomCursor
      labelSize={84}
      className="grid w-full max-w-2xl gap-3 overflow-hidden rounded-xl p-1 sm:grid-cols-3"
    >
      {tiles.map((tile) => (
        <button
          key={tile.title}
          type="button"
          data-cursor-label={tile.label}
          className={`flex h-48 flex-col justify-end rounded-xl bg-linear-to-br ${tile.tone} p-4 text-left outline-none ring-white/60 focus-visible:ring-2`}
        >
          <span className="text-sm font-medium text-white">{tile.title}</span>
          <span className="text-xs text-white/70">{tile.label} →</span>
        </button>
      ))}
    </CustomCursor>
  );
}
