import { DotSpotlight } from "@/components/dusk/backgrounds/dot-spotlight";

const variants = [
  { label: "gap={14} dotSize={1}", props: { gap: 14, dotSize: 1, radius: 120 } },
  { label: "gap={28} dotSize={1.5}", props: { gap: 28, dotSize: 1.5, color: "rgb(196 181 253 / 0.45)" } },
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
