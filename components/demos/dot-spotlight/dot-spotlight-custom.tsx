import { DotSpotlight } from "@/components/dusk/backgrounds/dot-spotlight";

const variants = [
  { label: "gap={14} dotSize={1}", props: { gap: 14, dotSize: 1, color: "#a78bfa", radius: 160 } },
  { label: "gap={28} glow={false}", props: { gap: 28, dotSize: 2, color: "#fbbf24", glow: false } },
];

export default function DotSpotlightCustom() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {variants.map((variant) => (
        <div
          key={variant.label}
          className="relative flex h-56 items-end overflow-hidden rounded-xl border border-white/10 bg-background p-4"
        >
          <DotSpotlight {...variant.props} />
          <span className="relative font-mono text-xs text-white/70">{variant.label}</span>
        </div>
      ))}
    </div>
  );
}
