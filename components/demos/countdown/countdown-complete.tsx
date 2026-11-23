"use client";

import * as React from "react";
import { Rocket, RotateCcw } from "lucide-react";

import { Countdown } from "@/components/dusk/countdown/countdown";

export default function CountdownComplete() {
  const [target, setTarget] = React.useState<number | null>(null);
  const [launches, setLaunches] = React.useState(0);
  React.useEffect(() => {
    setTarget(Date.now() + 10_000);
  }, []);

  return (
    <div className="flex w-full flex-col items-center gap-5 rounded-xl border border-white/10 bg-background px-6 py-10">
      <Countdown
        target={target}
        units={["minutes", "seconds"]}
        label="Liftoff countdown"
        completeText="Liftoff"
        onComplete={() => setLaunches((n) => n + 1)}
        completed={
          <div className="flex h-[94px] items-center gap-3 text-2xl font-semibold text-foreground sm:h-[118px] sm:text-3xl">
            <Rocket aria-hidden className="size-7 text-muted-foreground" /> Liftoff
          </div>
        }
      />
      <div className="flex items-center gap-4 text-sm text-white/60">
        <span>onComplete fired {launches}×</span>
        <button
          type="button"
          onClick={() => setTarget(Date.now() + 10_000)}
          className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none"
        >
          <RotateCcw aria-hidden className="size-3.5" /> Restart
        </button>
      </div>
    </div>
  );
}
