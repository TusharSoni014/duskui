"use client";

import * as React from "react";

import { Countdown } from "@/components/dusk/countdown/countdown";

export default function CountdownFlip() {
  const [target, setTarget] = React.useState<number | null>(null);
  React.useEffect(() => {
    setTarget(Date.now() + 2 * 3_600_000 + 15 * 60_000);
  }, []);

  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-xl border border-white/10 bg-background px-6 py-10">
      <Countdown
        target={target}
        units={["hours", "minutes", "seconds"]}
        animation="flip"
        label="Time until the stream starts"
      />
      <p className="text-sm text-muted-foreground">Until the stream starts</p>
    </div>
  );
}
