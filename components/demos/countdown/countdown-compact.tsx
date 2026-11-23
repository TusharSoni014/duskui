"use client";

import * as React from "react";
import { Zap } from "lucide-react";

import { Countdown } from "@/components/dusk/countdown/countdown";

export default function CountdownCompact() {
  const [ends, setEnds] = React.useState<number | null>(null);
  React.useEffect(() => {
    setEnds(Date.now() + 5 * 3_600_000 + 33 * 60_000 + 20_000);
  }, []);

  return (
    <div className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-background p-6">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-full border bg-card px-4 py-2 text-sm">
        <Zap aria-hidden className="size-4 text-muted-foreground" />
        <span className="text-foreground">Spring sale: 40% off annual plans</span>
        <span className="text-muted-foreground">ends in</span>
        <Countdown target={ends} variant="compact" units={["hours", "minutes", "seconds"]} label="Sale ends in" />
      </div>
    </div>
  );
}
