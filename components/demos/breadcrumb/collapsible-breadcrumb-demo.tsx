"use client";

import * as React from "react";
import { House } from "lucide-react";

import { CollapsibleBreadcrumb } from "@/components/dusk/breadcrumb/collapsible-breadcrumb";

const trail = [
  { label: "Home", href: "#home", icon: <House aria-hidden /> },
  { label: "Acme Inc.", href: "#acme" },
  { label: "Projects", href: "#projects" },
  { label: "Night Market", href: "#night-market" },
  { label: "Design system", href: "#design-system" },
  { label: "Components", href: "#components" },
  { label: "Breadcrumb.tsx" },
];

export default function CollapsibleBreadcrumbDemo() {
  const [width, setWidth] = React.useState(100);
  const id = React.useId();

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <div
        className="rounded-xl border border-white/10 bg-card/60 px-4 py-3"
        style={{ width: `${width}%` }}
      >
        <CollapsibleBreadcrumb items={trail} />
      </div>
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <label htmlFor={id} className="shrink-0">
          Container width
        </label>
        <input
          id={id}
          type="range"
          min={30}
          max={100}
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
          className="w-full accent-(--color-primary)"
        />
        <span className="w-10 text-right tabular-nums">{width}%</span>
      </div>
    </div>
  );
}
