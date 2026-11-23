"use client";

import * as React from "react";
import { Bell, Plus } from "lucide-react";

import { AnimatedList, useListStream } from "@/components/dusk/animated-list/animated-list";
import { Button } from "@/components/ui/button";

const messages = [
  "Backup completed",
  "2 new followers",
  "Invoice #1042 is due tomorrow",
  "Your export is ready",
  "Weekly report generated",
  "Disk usage at 80%",
];

export default function AnimatedListManualDemo() {
  const [max, setMax] = React.useState(3);
  // Paused stream = a queue you push from manually.
  const { items, push } = useListStream(messages, { paused: true, limit: 8 });

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button size="sm" onClick={push}>
          <Plus aria-hidden /> Add notification
        </Button>
        <div role="group" aria-label="Visible items" className="flex rounded-md border border-white/10 p-0.5">
          {[3, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={max === n}
              onClick={() => setMax(n)}
              className="rounded px-2.5 py-1 text-xs text-white/60 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-ring/50 aria-pressed:bg-white/10 aria-pressed:text-white"
            >
              Max {n}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[17.5rem]">
        {items.length === 0 && (
          <p className="pt-10 text-center text-sm text-white/40">No notifications yet. Add one.</p>
        )}
        <AnimatedList max={max} className="gap-2" aria-label="Notifications">
          {items.map(({ id, item }) => (
            <div key={id} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
              <Bell aria-hidden className="size-4 text-muted-foreground" />
              <span className="text-sm text-white/80">{item}</span>
              <span className="ml-auto text-xs tabular-nums text-white/35">#{id + 1}</span>
            </div>
          ))}
        </AnimatedList>
      </div>
    </div>
  );
}
