"use client";

import * as React from "react";
import { Bell, TrendingUp } from "lucide-react";
import { ThemeToggle } from "@/components/dusk/theme-toggle/theme-toggle";

// The docs site is dark-only, so this preview carries its own light and dark
// palette as CSS variables and only this panel is switched.
const palette = [
  "[--pv-bg:#ffffff] [--pv-fg:#0a0a0a] [--pv-muted:#71717a] [--pv-card:#f4f4f5] [--pv-border:#e4e4e7] [--pv-accent:#059669]",
  "[&.dark]:[--pv-bg:#0a0a0a] [&.dark]:[--pv-fg:#f4f4f5] [&.dark]:[--pv-muted:#a1a1aa] [&.dark]:[--pv-card:#18181b] [&.dark]:[--pv-border:#27272a] [&.dark]:[--pv-accent:var(--color-primary)]",
].join(" ");

const stats = [
  { label: "Visitors", value: "24.8k", change: "+12%" },
  { label: "Signups", value: "1,204", change: "+8%" },
];

export default function ThemeToggleDemo() {
  const preview = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={preview}
      // Starts dark to match the toggle's default theme, so there is no flash on load.
      className={`dark ${palette} w-full max-w-sm overflow-hidden rounded-xl border border-(--pv-border) bg-(--pv-bg) text-(--pv-fg) shadow-lg`}
    >
      <header className="flex items-center justify-between border-b border-(--pv-border) px-5 py-3">
        <span className="font-semibold tracking-tight">Acme Analytics</span>
        <div className="flex items-center gap-1">
          <span className="grid size-9 place-items-center rounded-full text-(--pv-muted)">
            <Bell className="size-[18px]" aria-hidden />
          </span>
          <ThemeToggle target={preview} />
        </div>
      </header>
      <div className="space-y-4 p-5">
        <p className="text-sm text-(--pv-muted)">Last 7 days</p>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl bg-(--pv-card) p-4">
              <p className="text-xs text-(--pv-muted)">{stat.label}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{stat.value}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-(--pv-accent)">
                <TrendingUp className="size-3.5" aria-hidden />
                {stat.change}
              </p>
            </div>
          ))}
        </div>
        <div className="flex h-20 items-end gap-1.5 rounded-xl bg-(--pv-card) p-3" aria-hidden>
          {[40, 65, 50, 80, 60, 95, 75].map((h, i) => (
            <span key={i} className="flex-1 rounded-sm bg-(--pv-muted)" style={{ height: `${h}%`, opacity: 0.5 }} />
          ))}
        </div>
      </div>
    </div>
  );
}
