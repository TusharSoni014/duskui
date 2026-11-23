import { BinaryRain } from "@/components/dusk/techy/binary-rain";

export default function BinaryRainDemo() {
  return (
    <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-background">
      <BinaryRain />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-background)_20%,transparent_70%)]" />
      <div className="relative text-center">
        <h3 className="text-3xl font-semibold tracking-tight text-white">Welcome back</h3>
        <p className="mt-2 text-sm text-white/60">Your last build finished 4 minutes ago.</p>
      </div>
    </div>
  );
}
