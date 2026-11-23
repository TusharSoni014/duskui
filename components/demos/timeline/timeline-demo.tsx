"use client";

import * as React from "react";

import { Timeline, TimelineItem } from "@/components/dusk/timeline/timeline";

const releases = [
  {
    version: "v3.0",
    date: "Nov 2026",
    dateTime: "2026-11",
    title: "Component library 3.0",
    body: "A flat component list, 20 new showcase components and a rebuilt docs site with live previews.",
    tags: ["Major", "Docs"],
  },
  {
    version: "v2.6",
    date: "Sep 2026",
    dateTime: "2026-09",
    title: "Scroll-linked everything",
    body: "Scroll Reveal Text, Blur Panel and a new container prop so effects work inside any scroll area.",
    tags: ["Feature"],
  },
  {
    version: "v2.4",
    date: "Jul 2026",
    dateTime: "2026-07",
    title: "Reduced motion audit",
    body: "Every component now checks prefers-reduced-motion and falls back to a calm, static state.",
    tags: ["Accessibility"],
  },
  {
    version: "v2.0",
    date: "Apr 2026",
    dateTime: "2026-04",
    title: "Motion 12 and React 19",
    body: "Moved to the motion package, layout animations everywhere and no more hydration warnings.",
    tags: ["Major"],
  },
  {
    version: "v1.0",
    date: "Jan 2026",
    dateTime: "2026-01",
    title: "First public release",
    body: "Buttons, cards and text effects built on shadcn/ui, with a neon mint dark theme.",
    tags: ["Launch"],
  },
];

export default function TimelineDemo() {
  const scroller = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scroller}
      tabIndex={0}
      aria-label="Changelog, scrollable"
      className="relative h-[26rem] w-full max-w-2xl overflow-y-auto rounded-xl border border-white/10 bg-black/30 px-5 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 [scrollbar-width:thin] sm:px-8"
    >
      <p className="sticky top-0 z-20 bg-linear-to-b from-black/80 to-transparent pt-4 pb-6 text-center text-xs uppercase tracking-widest text-white/40">
        Scroll inside ↓
      </p>
      <h3 className="mb-8 text-2xl font-semibold tracking-tight">Changelog</h3>
      <Timeline container={scroller} anchor={0.55} stickyTop="3.5rem">
        {releases.map((r) => (
          <TimelineItem key={r.version} date={r.date} dateTime={r.dateTime} title={`${r.version} · ${r.title}`}>
            <p>{r.body}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Tags">
              {r.tags.map((tag) => (
                <li key={tag} className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-white/55">
                  {tag}
                </li>
              ))}
            </ul>
            {/* Placeholder for screenshots, release notes… */}
            <div aria-hidden className="mt-4 h-24 rounded-lg border border-white/5 bg-linear-to-br from-primary/10 via-white/[0.02] to-transparent" />
          </TimelineItem>
        ))}
      </Timeline>
      <div className="h-48" />
    </div>
  );
}
