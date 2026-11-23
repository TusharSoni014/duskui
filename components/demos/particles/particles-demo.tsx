import { Particles } from "@/components/dusk/backgrounds/particles";

export default function ParticlesDemo() {
  return (
    <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-background">
      <Particles quantity={60} connect />
      <div className="relative px-6 text-center">
        <h3 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Connect your services</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/60">Link databases, queues and APIs in one private network.</p>
      </div>
    </div>
  );
}
