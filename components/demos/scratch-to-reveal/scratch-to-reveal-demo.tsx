"use client";

import * as React from "react";
import { Gift } from "lucide-react";

import { ScratchToReveal } from "@/components/dusk/scratch-to-reveal/scratch-to-reveal";

export default function ScratchToRevealDemo() {
  const [won, setWon] = React.useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <ScratchToReveal
        className="h-44 w-full max-w-80 border border-white/10"
        minScratchPercentage={45}
        onComplete={() => setWon(true)}
      >
        <div className="flex size-full flex-col items-center justify-center gap-2 bg-card">
          <Gift className="size-5 text-muted-foreground" aria-hidden />
          <p className="text-sm text-white/60">You unlocked</p>
          <p className="text-2xl font-semibold tracking-tight text-white">25% off</p>
          <code className="rounded-md border border-dashed border-white/20 px-2 py-0.5 font-mono text-xs text-white/80">
            DUSK-25
          </code>
        </div>
      </ScratchToReveal>
      <p aria-live="polite" className="h-5 text-sm text-white/50">
        {won ? "Revealed. onComplete fired." : "Scratch at least 45% of the foil."}
      </p>
    </div>
  );
}
