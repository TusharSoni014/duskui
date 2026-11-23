import { Lens } from "@/components/dusk/lens/lens";

export default function LensPattern() {
  return (
    <Lens
      zoom={3.5}
      size={220}
      lensClassName="border-primary/60 shadow-[0_0_30px_color-mix(in_oklab,var(--color-primary)_35%,transparent)]"
      aria-label="Gradient swatch magnifier. Use the arrow keys to move the lens."
      className="h-72 w-full max-w-xl border border-white/10"
    >
      <div
        className="size-full"
        style={{
          backgroundColor: "#04110d",
          backgroundImage: [
            "radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.35) 0.6px, transparent 1px)",
            "conic-gradient(from 210deg at 30% 40%, #22d3ee33, #a78bfa44, #f472b633, #34d39944, #22d3ee33)",
          ].join(", "),
          backgroundSize: "8px 8px, 100% 100%",
        }}
      />
    </Lens>
  );
}
