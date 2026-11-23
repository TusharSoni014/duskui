import { HologramCard } from "@/components/dusk/techy/hologram-card";

const stats = [
  { label: "Commits", value: "4,218" },
  { label: "Streak", value: "132d" },
  { label: "Rank", value: "S+" },
];

export default function HologramCardProfile() {
  return (
    <HologramCard maxTilt={14} color="#a78bfa" className="w-full max-w-xs text-center">
      <div className="mx-auto grid size-16 place-items-center rounded-full border border-white/15 bg-white/5 text-xl font-semibold text-white">
        KN
      </div>
      <h3 className="mt-3 text-lg font-semibold text-white">Kai Nakamura</h3>
      <p className="text-sm text-white/55">Open-source maintainer · Legendary</p>
      <dl className="mt-5 grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-white/10 bg-black/20 py-2">
            <dt className="text-[11px] text-white/45">{s.label}</dt>
            <dd className="font-mono text-sm text-white">{s.value}</dd>
          </div>
        ))}
      </dl>
    </HologramCard>
  );
}
