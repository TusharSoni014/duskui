import { CircuitBoard } from "@/components/dusk/techy/circuit-board";

export default function CircuitBoardDemo() {
  return (
    <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-background">
      <CircuitBoard />
      <div className="relative px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Edge runtime</p>
        <h3 className="mt-2 text-3xl font-semibold tracking-tight text-white">Wired for speed</h3>
        <p className="mt-2 text-sm text-white/60">Deploy to 300 regions in a single push.</p>
      </div>
    </div>
  );
}
