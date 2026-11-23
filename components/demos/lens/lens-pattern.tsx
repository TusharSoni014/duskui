import { Lens } from "@/components/dusk/lens/lens";

export default function LensPattern() {
  return (
    <Lens
      zoom={3.5}
      size={220}
      aria-label="Dot grid magnifier. Use the arrow keys to move the lens."
      className="h-72 w-full max-w-xl border border-white/10"
    >
      <div
        className="size-full bg-card"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.3) 0.6px, transparent 1px)",
          backgroundSize: "8px 8px",
        }}
      />
    </Lens>
  );
}
