import { CircuitBoard } from "@/components/dusk/techy/circuit-board";

const boards = [
  { label: "Indigo", color: "#a5b4fc", seed: 7 },
  { label: "Sky", color: "#7dd3fc", seed: 21 },
];

export default function CircuitBoardColors() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {boards.map((board) => (
        <div
          key={board.label}
          className="relative flex h-56 items-end overflow-hidden rounded-xl border border-white/10 bg-background p-4"
        >
          <CircuitBoard color={board.color} seed={board.seed} />
          <span className="relative font-mono text-xs text-white/70">color=&quot;{board.color}&quot;</span>
        </div>
      ))}
    </div>
  );
}
