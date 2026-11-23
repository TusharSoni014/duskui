import { CustomCursor } from "@/components/dusk/custom-cursor/custom-cursor";

const presets = [
  { name: "Snappy", spring: { stiffness: 900, damping: 50, mass: 0.3 }, ringSize: 24 },
  { name: "Floaty", spring: { stiffness: 120, damping: 18, mass: 0.9 }, ringSize: 44 },
];

export default function CustomCursorSprings() {
  return (
    <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
      {presets.map((preset) => (
        <CustomCursor
          key={preset.name}
          spring={preset.spring}
          ringSize={preset.ringSize}
          className="flex h-56 flex-col items-center justify-center gap-4 overflow-hidden rounded-xl border border-white/10 bg-background"
        >
          <p className="text-lg font-semibold text-white">{preset.name}</p>
          <code className="font-mono text-[11px] text-white/55">
            stiffness {preset.spring.stiffness} · damping {preset.spring.damping}
          </code>
          <button
            type="button"
            data-cursor="hover"
            className="rounded-md border border-white/15 px-3 py-1.5 text-xs text-white/80"
          >
            Hover me
          </button>
        </CustomCursor>
      ))}
    </div>
  );
}
