import { Particles } from "@/components/dusk/backgrounds/particles";

export default function ParticlesAttract() {
  return (
    <div className="relative flex h-72 w-full items-end overflow-hidden rounded-xl border border-white/10 bg-background p-5">
      <Particles
        quantity={160}
        interaction="attract"
        color="#38bdf8"
        size={1.1}
        radius={160}
        strength={1.4}
        ease={0.05}
      />
      <div className="relative">
        <p className="text-sm font-medium text-white">interaction=&quot;attract&quot;</p>
        <p className="text-sm text-white/60">Particles gather around the cursor; a lower ease makes them trail behind.</p>
      </div>
    </div>
  );
}
