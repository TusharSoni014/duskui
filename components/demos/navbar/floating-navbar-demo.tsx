"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { FloatingNavbar } from "@/components/dusk/navbar/floating-navbar";

const links = [
  { label: "Overview", href: "#overview" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Changelog", href: "#changelog" },
];

export default function FloatingNavbarDemo() {
  const scroller = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(links[0].href);

  // In the demo, links scroll the preview instead of the page.
  const navigate = (href: string, event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setActive(href);
    const section = scroller.current?.querySelector<HTMLElement>(`[data-section="${href.slice(1)}"]`);
    if (section && scroller.current) {
      scroller.current.scrollTo({ top: section.offsetTop - 8, behavior: "smooth" });
    }
  };

  return (
    <div
      ref={scroller}
      role="region"
      tabIndex={0}
      aria-label="Scroll the preview to hide and reveal the navbar"
      className="relative h-[26rem] w-full overflow-y-auto overscroll-contain rounded-xl border border-white/10 bg-background outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <FloatingNavbar
        container={scroller}
        links={links}
        activeHref={active}
        onNavigate={navigate}
        logo={
          <span className="font-semibold tracking-tight">
            dusk.ui
          </span>
        }
        actions={<Button size="sm">Get started</Button>}
      />
      <div className="space-y-4 px-4 pt-4 pb-[60vh]">
        {links.map((link) => (
          <section
            key={link.href}
            data-section={link.href.slice(1)}
            className="rounded-xl border border-white/10 bg-card p-6"
          >
            <h3 className="text-lg font-semibold">{link.label}</h3>
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
              Scroll down and the navbar slides away to give the content room; scroll up a little and
              it drops right back. Click a link and the pill glides over.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[0, 1, 2].map((n) => (
                <div key={n} className="h-16 rounded-lg bg-white/5" />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
