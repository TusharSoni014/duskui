"use client";

import * as React from "react";

import { ScrollRevealText } from "@/components/dusk/text/scroll-reveal-text";

export default function ScrollRevealTextQuoteDemo() {
  const scroller = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scroller}
      tabIndex={0}
      aria-label="Scrollable example"
      className="relative h-80 w-full max-w-xl overflow-y-auto rounded-xl border border-white/10 bg-black/30 px-8 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 [scrollbar-width:thin]"
    >
      <div className="h-48" />
      <figure>
        <ScrollRevealText
          as="blockquote"
          container={scroller}
          baseOpacity={0.08}
          offset={["start 0.9", "end 0.6"]}
          wordClassName="text-primary"
          className="font-serif text-3xl leading-tight italic"
        >
          “We shipped the redesign on a Friday night. By Monday, nobody remembered the old one.”
        </ScrollRevealText>
        <figcaption className="mt-4 text-sm text-white/50">— Someone who deploys on Fridays</figcaption>
      </figure>
      <div className="h-56" />
    </div>
  );
}
