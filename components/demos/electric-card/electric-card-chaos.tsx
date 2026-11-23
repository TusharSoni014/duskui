import { ElectricCard } from "@/components/dusk/neon/electric-card";

export default function ElectricCardChaosDemo() {
  return (
    <>
      <ElectricCard color="#a78bfa" chaos={3} arcs={1} speed={0.2} className="w-56">
        <p className="font-semibold">Calm</p>
        <p className="mt-1 text-sm text-white/60">One soft arc, low chaos.</p>
      </ElectricCard>
      <ElectricCard color="#facc15" chaos={10} arcs={4} speed={0.6} className="w-56">
        <p className="font-semibold">Storm</p>
        <p className="mt-1 text-sm text-white/60">Four wild arcs, high chaos.</p>
      </ElectricCard>
    </>
  );
}
