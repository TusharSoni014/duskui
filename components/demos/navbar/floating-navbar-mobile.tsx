"use client";

import * as React from "react";

import { FloatingNavbar } from "@/components/dusk/navbar/floating-navbar";

const links = [
  { label: "Home", href: "#home" },
  { label: "Components", href: "#components" },
  { label: "Templates", href: "#templates" },
  { label: "Blog", href: "#blog" },
];

export default function FloatingNavbarMobileDemo() {
  const scroller = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scroller}
      role="region"
      tabIndex={0}
      aria-label="Narrow preview of the navbar"
      className="relative h-96 w-full max-w-sm overflow-y-auto overscroll-contain rounded-[1.75rem] border border-white/10 bg-background outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <FloatingNavbar
        container={scroller}
        links={links}
        onNavigate={(_, event) => event.preventDefault()}
        logo={
          <span className="font-semibold tracking-tight">
            dusk.ui
          </span>
        }
      />
      <div className="space-y-3 px-4 pt-4 pb-[40vh]">
        <p className="text-sm text-muted-foreground">Open the menu, then scroll.</p>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-24 rounded-xl border border-white/10 bg-white/[0.03]" />
        ))}
      </div>
    </div>
  );
}
