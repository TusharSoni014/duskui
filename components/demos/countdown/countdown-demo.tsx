"use client";

import * as React from "react";

import { Countdown } from "@/components/dusk/countdown/countdown";

const DAY = 86_400_000;

export default function CountdownDemo() {
  // Computed after mount so the server and the browser render the same placeholders.
  const [launch, setLaunch] = React.useState<number | null>(null);
  React.useEffect(() => {
    setLaunch(Date.now() + 12 * DAY + 7 * 3_600_000 + 42 * 60_000);
  }, []);

  return (
    <div className="flex w-full flex-col items-center rounded-xl border border-white/10 bg-background px-6 py-12 text-center">
      <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Dusk 2.0 goes live in</h3>
      <Countdown target={launch} label="Time until launch" className="mt-8" />
    </div>
  );
}
