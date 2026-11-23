import { Particles } from "@/components/dusk/backgrounds/particles";

export default function ParticlesStarfield() {
  return (
    <div className="relative flex h-72 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-background">
      <Particles quantity={180} color="#ffffff" size={0.8} speed={0.35} interaction="none" seed={12} />
      <div className="relative rounded-xl border border-white/10 bg-card/80 px-6 py-5 text-center backdrop-blur-sm">
        <p className="text-2xl font-semibold tabular-nums text-white">1,204,388</p>
        <p className="mt-1 text-sm text-white/60">stars catalogued this week</p>
      </div>
    </div>
  );
}
