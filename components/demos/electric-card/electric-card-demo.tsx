import { Zap } from "lucide-react";
import { ElectricCard } from "@/components/dusk/neon/electric-card";
import { NeonButton } from "@/components/dusk/neon/neon-button";

export default function ElectricCardDemo() {
  return (
    <ElectricCard className="w-full max-w-sm">
      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Zap className="size-5" aria-hidden />
      </div>
      <h3 className="mt-4 text-lg font-semibold">Edge Functions</h3>
      <p className="mt-1 text-sm leading-relaxed text-white/60">
        Run code close to your users with cold starts under 50ms. Hover or tab into this card.
      </p>
      <NeonButton size="sm" className="mt-5">
        Deploy now
      </NeonButton>
    </ElectricCard>
  );
}
