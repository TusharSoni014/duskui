import { Ticket } from "lucide-react";

import { ScratchToReveal } from "@/components/dusk/scratch-to-reveal/scratch-to-reveal";

export default function ScratchToRevealHolo() {
  return (
    <ScratchToReveal
      className="h-52 w-full max-w-sm border border-white/10"
      gradientColors={["#3b0764", "#a855f7", "#f0abfc", "#22d3ee", "#1e3a8a"]}
      brushSize={28}
      showRevealButton
      revealLabel="Reveal ticket"
      hint="Scratch the hologram"
    >
      <div className="flex size-full items-center gap-4 bg-card px-6">
        <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-violet-500/15">
          <Ticket className="size-7 text-violet-300" aria-hidden />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-white/45">Admit one</p>
          <p className="text-xl font-semibold text-white">Dusk Live · Row F, Seat 12</p>
          <p className="mt-1 font-mono text-xs text-white/50">Sat 21:00 · Hall B</p>
        </div>
      </div>
    </ScratchToReveal>
  );
}
