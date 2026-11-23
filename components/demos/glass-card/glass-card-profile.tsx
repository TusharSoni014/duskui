import { BadgeCheck } from "lucide-react";

import { GlassCard } from "@/components/dusk/glass/glass-card";
import { FrostButton } from "@/components/dusk/glass/frost-button";
import { GlassBackdrop } from "@/components/demos/glass-card/glass-backdrop";

const stats = [
  { label: "Components", value: "128" },
  { label: "Stars", value: "9.4k" },
  { label: "Followers", value: "2.1k" },
];

export default function GlassCardProfile() {
  return (
    <>
      <GlassBackdrop />
      <GlassCard className="w-full max-w-xs text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-full border border-white/15 bg-background/60 text-lg font-semibold">
          NK
        </div>
        <h3 className="mt-3 inline-flex items-center gap-1.5 font-semibold">
          Noor Khalil
          <BadgeCheck className="size-4 text-white/70" aria-hidden />
          <span className="sr-only">(verified)</span>
        </h3>
        <p className="text-sm text-white/70">Motion designer · Lisbon</p>
        <dl className="mt-5 grid grid-cols-3 gap-2 rounded-lg bg-white/5 p-3">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse">
              <dt className="text-[0.7rem] text-white/60">{s.label}</dt>
              <dd className="font-semibold">{s.value}</dd>
            </div>
          ))}
        </dl>
        <FrostButton tone="primary" className="mt-5 w-full">
          Follow
        </FrostButton>
      </GlassCard>
    </>
  );
}
