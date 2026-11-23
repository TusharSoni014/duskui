import { Meteors } from "@/components/dusk/backgrounds/meteors";

export default function MeteorsDemo() {
  return (
    <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-background">
      <Meteors />
      <div className="relative px-6 text-center">
        <h3 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Launch week</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/60">One new feature every day, Monday to Friday.</p>
      </div>
    </div>
  );
}
