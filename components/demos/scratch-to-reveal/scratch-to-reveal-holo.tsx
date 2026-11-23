import { Ticket } from "lucide-react";

import { ScratchToReveal } from "@/components/dusk/scratch-to-reveal/scratch-to-reveal";

export default function ScratchToRevealHolo() {
  return (
    <ScratchToReveal
      className="h-52 w-full max-w-sm border border-white/10"
      gradientColors={["#44403c", "#78716c", "#d6d3d1", "#78716c", "#44403c"]}
      brushSize={28}
      showRevealButton
      revealLabel="Reveal ticket"
      hint="Scratch to see your seat"
    >
      <div className="flex size-full items-center gap-4 bg-card px-6">
        <div className="grid size-14 shrink-0 place-items-center rounded-md border bg-muted">
          <Ticket className="size-6 text-muted-foreground" aria-hidden />
        </div>
        <div>
          <p className="text-xs text-white/50">Admit one</p>
          <p className="text-lg font-semibold tracking-tight text-white">Row F, Seat 12</p>
          <p className="mt-1 text-xs text-white/50">Sat 21:00 · Hall B</p>
        </div>
      </div>
    </ScratchToReveal>
  );
}
