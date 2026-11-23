import { Meteors } from "@/components/dusk/backgrounds/meteors";

export default function MeteorsDemo() {
  return (
    <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-background">
      <Meteors />
      <div className="relative px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Launch week</p>
        <h3 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Make a wish</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-white/60">Five new features, one every night this week.</p>
      </div>
    </div>
  );
}
