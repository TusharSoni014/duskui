import { BinaryRain } from "@/components/dusk/techy/binary-rain";

export default function BinaryRainDemo() {
  return (
    <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-background">
      <BinaryRain />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-background)_20%,transparent_70%)]" />
      <div className="relative text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Access granted</p>
        <h3 className="mt-2 text-3xl font-semibold tracking-tight text-white">Welcome back, operator</h3>
      </div>
    </div>
  );
}
