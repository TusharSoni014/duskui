import { CustomCursor } from "@/components/dusk/custom-cursor/custom-cursor";

const tiles = [
  { title: "Night drive", label: "Play", tone: "bg-zinc-800" },
  { title: "Field notes", label: "Read", tone: "bg-stone-800" },
  { title: "Lowlight", label: "View", tone: "bg-neutral-800" },
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
          className={`flex h-48 flex-col justify-end rounded-xl border ${tile.tone} p-4 text-left outline-none ring-white/60 focus-visible:ring-2`}
        >
          <span className="text-sm font-medium text-white">{tile.title}</span>
          <span className="text-xs text-white/70">{tile.label} →</span>
        </button>
      ))}
    </CustomCursor>
  );
}
