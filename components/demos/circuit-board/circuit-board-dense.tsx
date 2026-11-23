import { CircuitBoard } from "@/components/dusk/techy/circuit-board";

export default function CircuitBoardDense() {
  return (
    <div className="relative h-72 w-full overflow-hidden rounded-xl border border-white/10 bg-background">
      <CircuitBoard density={0.9} cellSize={14} speed={220} fade={false} seed={42} />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/80 to-transparent p-5 pt-16">
        <p className="text-sm font-medium text-white">density=0.9 · cellSize=14 · speed=220</p>
        <p className="text-sm text-white/60">A busy, edge-to-edge board for footers and section dividers.</p>
      </div>
    </div>
  );
}
