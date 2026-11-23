import { HologramCard } from "@/components/dusk/techy/hologram-card";

export default function HologramCardMinimal() {
  return (
    <>
      <HologramCard maxTilt={4} scanlines className="w-56">
        <p className="text-sm font-medium text-white">Scanlines</p>
        <p className="mt-1 text-sm text-white/55">maxTilt=4 with faint static scanlines.</p>
      </HologramCard>
      <HologramCard maxTilt={0} className="w-56">
        <p className="text-sm font-medium text-white">Flat foil</p>
        <p className="mt-1 text-sm text-white/55">No tilt. The foil sheen still shifts with the pointer.</p>
      </HologramCard>
    </>
  );
}
