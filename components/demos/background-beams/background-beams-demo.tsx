import { BackgroundBeams } from "@/components/dusk/backgrounds/background-beams";

export default function BackgroundBeamsDemo() {
  return (
    <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-background">
      <BackgroundBeams />
      <div className="relative px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Realtime</p>
        <h3 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Every event, in flight</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-white/60">
          Stream changes from your database to every client in milliseconds.
        </p>
      </div>
    </div>
  );
}
