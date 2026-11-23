"use client";

import * as React from "react";

import { ScrollRevealText } from "@/components/dusk/text/scroll-reveal-text";

export default function ScrollRevealTextDemo() {
  const scroller = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scroller}
      tabIndex={0}
      aria-label="Scrollable example"
      className="relative h-80 w-full max-w-xl overflow-y-auto rounded-xl border border-white/10 bg-black/30 px-6 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 [scrollbar-width:thin]"
    >
      <p className="sticky top-0 bg-linear-to-b from-black/60 to-transparent pb-6 pt-4 text-center text-xs text-white/40">
        Scroll inside ↓
      </p>
      <div className="h-40" />
      <ScrollRevealText container={scroller} className="text-2xl font-semibold leading-snug tracking-tight">
        Good interfaces don&apos;t shout. They wait until you arrive, then reveal exactly what you need,
        one idea at a time, and get out of the way the moment you understand.
      </ScrollRevealText>
      <div className="h-56" />
    </div>
  );
}
