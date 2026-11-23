import { CircuitBoard } from "@/components/dusk/techy/circuit-board";

export default function CircuitBoardDemo() {
  return (
    <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-background">
      <CircuitBoard />
      <div className="relative px-6 text-center">
        <h3 className="text-3xl font-semibold tracking-tight text-white">Edge functions</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/60">Run code close to your users in 30 regions.</p>
      </div>
    </div>
  );
}
