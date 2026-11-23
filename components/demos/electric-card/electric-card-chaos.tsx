import { ElectricCard } from "@/components/dusk/neon/electric-card";

export default function ElectricCardChaosDemo() {
  return (
    <>
      <ElectricCard color="#a78bfa" chaos={2} speed={0.15} className="w-56">
        <p className="font-semibold">Calm</p>
        <p className="mt-1 text-sm text-white/60">One arc, low chaos.</p>
      </ElectricCard>
      <ElectricCard color="#facc15" chaos={7} arcs={3} speed={0.4} className="w-56">
        <p className="font-semibold">Storm</p>
        <p className="mt-1 text-sm text-white/60">Three arcs, more chaos.</p>
      </ElectricCard>
    </>
  );
}
