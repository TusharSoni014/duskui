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
        <div className="mx-auto size-16 rounded-full bg-linear-to-br from-primary via-sky-400 to-violet-500 p-0.5">
          <div className="grid size-full place-items-center rounded-full bg-background/70 text-lg font-semibold">
            NK
          </div>
        </div>
        <h3 className="mt-3 inline-flex items-center gap-1.5 font-semibold">
          Noor Khalil
          <BadgeCheck className="size-4 text-primary" aria-hidden />
          <span className="sr-only">(verified)</span>
        </h3>
        <p className="text-sm text-white/70">Motion designer · Lisbon</p>
        <dl className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-white/5 p-3">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse">
              <dt className="text-[0.7rem] text-white/60">{s.label}</dt>
              <dd className="font-semibold">{s.value}</dd>
            </div>
          ))}
        </dl>
        <FrostButton tone="primary" className="mt-5 w-full rounded-full">
          Follow
        </FrostButton>
      </GlassCard>
    </>
  );
}
