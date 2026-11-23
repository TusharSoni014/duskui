import { Particles } from "@/components/dusk/backgrounds/particles";

export default function ParticlesDemo() {
  return (
    <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-background">
      <Particles quantity={90} connect />
      <div className="relative px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Network</p>
        <h3 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Everything, connected</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-white/60">Move your cursor through the field to part it.</p>
      </div>
    </div>
  );
}
