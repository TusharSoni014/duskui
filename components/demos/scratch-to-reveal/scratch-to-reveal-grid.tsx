import { ScratchToReveal } from "@/components/dusk/scratch-to-reveal/scratch-to-reveal";

const prizes = [
  { emoji: "🍀", label: "Lucky" },
  { emoji: "⭐", label: "Star" },
  { emoji: "🍀", label: "Lucky" },
];

export default function ScratchToRevealGrid() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="grid grid-cols-3 gap-3">
        {prizes.map((prize, i) => (
          <ScratchToReveal
            key={i}
            aria-label={`Tile ${i + 1}`}
            className="size-24 rounded-lg border border-white/10"
            brushSize={12}
            minScratchPercentage={30}
            hint={null}
            revealLabel={`Reveal tile ${i + 1}`}
          >
            <div className="flex size-full flex-col items-center justify-center gap-1 bg-card">
              <span className="text-3xl" aria-hidden>
                {prize.emoji}
              </span>
              <span className="text-[11px] text-white/60">{prize.label}</span>
            </div>
          </ScratchToReveal>
        ))}
      </div>
      <p className="text-xs text-white/55">Small brush, 30% threshold</p>
    </div>
  );
}
