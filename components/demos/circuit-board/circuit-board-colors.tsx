import { CircuitBoard } from "@/components/dusk/techy/circuit-board";

const boards = [
  { label: "Violet", color: "#a78bfa", seed: 7 },
  { label: "Sky", color: "#38bdf8", seed: 21 },
];

export default function CircuitBoardColors() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {boards.map((board) => (
        <div
          key={board.label}
          className="relative flex h-56 items-end overflow-hidden rounded-xl border border-white/10 bg-background p-4"
        >
          <CircuitBoard color={board.color} seed={board.seed} density={0.6} />
          <span className="relative font-mono text-xs text-white/70">color=&quot;{board.color}&quot;</span>
        </div>
      ))}
    </div>
  );
}
