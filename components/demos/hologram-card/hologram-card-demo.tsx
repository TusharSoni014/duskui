import { Cpu } from "lucide-react";
import { HologramCard } from "@/components/dusk/techy/hologram-card";

export default function HologramCardDemo() {
  return (
    <HologramCard className="flex aspect-[1.586] w-full max-w-sm flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-white/50">Access pass</p>
          <p className="mt-1 text-lg font-semibold text-white">Dusk Conf 2026</p>
        </div>
        <Cpu className="size-6 text-white/60" aria-hidden />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-medium text-white">Mira Okafor</p>
          <p className="text-xs text-white/50">Speaker · All areas</p>
        </div>
        <p className="text-xs tabular-nums text-white/40">#0042</p>
      </div>
    </HologramCard>
  );
}
