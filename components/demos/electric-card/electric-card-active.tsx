import { ElectricCard } from "@/components/dusk/neon/electric-card";

export default function ElectricCardActiveDemo() {
  return (
    <ElectricCard active color="#22d3ee" radius={24} className="w-full max-w-xs text-center">
      <p className="text-sm font-medium text-[#22d3ee]">Live</p>
      <p className="mt-1 text-3xl font-bold tabular-nums">1,284</p>
      <p className="text-sm text-white/60">requests per second</p>
    </ElectricCard>
  );
}
