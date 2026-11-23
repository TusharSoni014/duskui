"use client";

import * as React from "react";
import { useInView } from "motion/react";

import { AnimatedList, useListStream } from "@/components/dusk/animated-list/animated-list";

const events = [
  { status: "ok", text: "Build #1284 succeeded", meta: "main · 42s" },
  { status: "info", text: "Preview deployed", meta: "feat/bento · 18s" },
  { status: "warn", text: "Cold start over budget", meta: "api/search · 820ms" },
  { status: "ok", text: "Cache warmed", meta: "32 regions" },
  { status: "error", text: "Health check failed", meta: "eu-west-2 · retrying" },
  { status: "ok", text: "Rollback complete", meta: "v2.4.1" },
] as const;

const dot: Record<(typeof events)[number]["status"], string> = {
  ok: "bg-emerald-400",
  info: "bg-sky-400",
  warn: "bg-amber-400",
  error: "bg-red-400",
};

export default function AnimatedListActivityDemo() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const { items } = useListStream(events, { initial: 2, interval: 1600, paused: !inView });

  return (
    <div ref={ref} className="w-full max-w-md rounded-xl border border-white/10 bg-card p-4">
      <p className="mb-3 text-sm font-medium text-white/80">Activity</p>
      <div className="h-[9.5rem] overflow-hidden">
        <AnimatedList as="ol" max={4} className="gap-1.5" aria-label="Deployment activity">
          {items.map(({ id, item }) => (
            <div key={id} className="flex items-center gap-3 rounded-md bg-white/[0.03] px-3 py-2 font-mono text-xs">
              <span aria-hidden className={`size-1.5 shrink-0 rounded-full ${dot[item.status]}`} />
              <span className="truncate text-white/80">{item.text}</span>
              <span className="ml-auto shrink-0 text-white/55">{item.meta}</span>
            </div>
          ))}
        </AnimatedList>
      </div>
    </div>
  );
}
