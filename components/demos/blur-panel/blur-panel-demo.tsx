"use client";

import * as React from "react";

import { BlurPanel } from "@/components/dusk/glass/blur-panel";

const posts = [
  { title: "Designing with light", tone: "from-fuchsia-500 via-rose-400 to-amber-300" },
  { title: "Motion that respects users", tone: "from-sky-400 via-violet-500 to-fuchsia-500" },
  { title: "The case for glass", tone: "from-primary via-emerald-400 to-sky-500" },
];

export default function BlurPanelDemo() {
  const scroller = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scroller}
      role="region"
      tabIndex={0}
      aria-label="Scroll the preview to frost the header"
      className="relative h-80 w-full max-w-lg overflow-y-auto overscroll-contain rounded-xl border border-white/10 bg-background outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <BlurPanel
        as="header"
        container={scroller}
        className="sticky top-0 z-10 flex h-14 items-center justify-between px-4"
      >
        <span className="font-semibold tracking-tight">
          dusk<span className="text-primary">.</span>blog
        </span>
        <nav aria-label="Demo" className="flex gap-4 text-sm text-white/75">
          <a href="#" onClick={(e) => e.preventDefault()} className="rounded-sm hover:text-white focus-visible:outline-2">
            Articles
          </a>
          <a href="#" onClick={(e) => e.preventDefault()} className="rounded-sm hover:text-white focus-visible:outline-2">
            About
          </a>
        </nav>
      </BlurPanel>

      {/* Pulled up under the header so it starts transparent over the hero. */}
      <div className="-mt-14">
        <div className="h-44 bg-[radial-gradient(circle_at_20%_30%,var(--color-primary),transparent_45%),radial-gradient(circle_at_80%_20%,#a855f7,transparent_45%),radial-gradient(circle_at_60%_90%,#f43f5e,transparent_50%)] px-5 pt-20">
          <p className="text-xs font-medium uppercase tracking-widest text-white/80">Journal</p>
          <h3 className="mt-1 text-2xl font-bold tracking-tight">Scroll me ↓</h3>
        </div>
        <div className="space-y-4 p-4">
          {posts.map((post) => (
            <article key={post.title} className="flex gap-4 rounded-lg border border-white/10 p-3">
              <div className={`size-20 shrink-0 rounded-md bg-linear-to-br ${post.tone}`} />
              <div>
                <h4 className="font-medium">{post.title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-white/60">
                  As the page scrolls, the header picks up blur, saturation and tint — the colors
                  underneath stay visible without hurting legibility.
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
