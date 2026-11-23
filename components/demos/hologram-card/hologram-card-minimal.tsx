import { HologramCard } from "@/components/dusk/techy/hologram-card";

export default function HologramCardMinimal() {
  return (
    <>
      <HologramCard maxTilt={6} scanlines={false} className="w-56">
        <p className="text-sm font-medium text-white">Subtle</p>
        <p className="mt-1 text-sm text-white/55">maxTilt=6, no scanlines.</p>
      </HologramCard>
      <HologramCard maxTilt={0} glare={false} className="w-56">
        <p className="text-sm font-medium text-white">Flat foil</p>
        <p className="mt-1 text-sm text-white/55">No tilt or glare — the foil still shifts.</p>
      </HologramCard>
    </>
  );
}
