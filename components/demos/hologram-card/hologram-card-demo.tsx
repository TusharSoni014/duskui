import { Cpu } from "lucide-react";
import { HologramCard } from "@/components/dusk/techy/hologram-card";

export default function HologramCardDemo() {
  return (
    <HologramCard className="flex aspect-[1.586] w-full max-w-sm flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">Access pass</p>
          <p className="mt-1 text-lg font-semibold text-white">Dusk Conf 2026</p>
        </div>
        <Cpu className="size-8 text-primary" aria-hidden />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-medium text-white">Mira Okafor</p>
          <p className="font-mono text-xs text-white/50">Level 07 · All areas</p>
        </div>
        <p className="font-mono text-xs text-white/40">#0042</p>
      </div>
    </HologramCard>
  );
}
