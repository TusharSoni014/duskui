import { BackgroundBeams } from "@/components/dusk/backgrounds/background-beams";

export default function BackgroundBeamsDemo() {
  return (
    <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-background">
      <BackgroundBeams />
      <div className="relative px-6 text-center">
        <h3 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Realtime sync</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/60">
          Changes in your database reach every connected client in under 100 ms.
        </p>
      </div>
    </div>
  );
}
