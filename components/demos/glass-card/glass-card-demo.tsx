import { Nfc } from "lucide-react";

import { GlassCard } from "@/components/dusk/glass/glass-card";
import { GlassBackdrop } from "@/components/demos/glass-card/glass-backdrop";

export default function GlassCardDemo() {
  return (
    <>
      <GlassBackdrop />
      <GlassCard tilt className="flex aspect-[1.6] w-full max-w-sm flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-white/70">Dusk Pass</p>
            <p className="mt-1 text-lg font-semibold">Business</p>
          </div>
          <Nfc className="size-6 text-white/80" aria-hidden />
        </div>
        <p className="text-lg tabular-nums tracking-wider text-white/90 sm:text-xl">
          4291 •••• •••• 0618
        </p>
        <div className="flex items-end justify-between text-sm">
          <div>
            <p className="text-xs text-white/60">Card holder</p>
            <p className="font-medium">Ava Lindqvist</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/60">Valid thru</p>
            <p className="font-medium">12/29</p>
          </div>
        </div>
      </GlassCard>
    </>
  );
}
