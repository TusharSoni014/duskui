"use client";

import * as React from "react";
import { ThemeToggle, type ThemeToggleProps } from "@/components/dusk/theme-toggle/theme-toggle";

const palette =
  "[--pv-bg:#fafafa] [--pv-fg:#18181b] [--pv-border:#e4e4e7] [&.dark]:[--pv-bg:#0b1411] [&.dark]:[--pv-fg:#f4f4f5] [&.dark]:[--pv-border:#1c2a25]";

const tiles: { label: string; props: Partial<ThemeToggleProps> }[] = [
  { label: "sm · ghost", props: { size: "sm", variant: "ghost" } },
  { label: "default", props: {} },
  { label: "lg · 1s reveal", props: { size: "lg", duration: 1000 } },
];

function Tile({ label, props }: (typeof tiles)[number]) {
  const ref = React.useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={`dark ${palette} flex w-36 flex-col items-center gap-3 rounded-xl border border-(--pv-border) bg-(--pv-bg) p-5 text-(--pv-fg)`}
    >
      <ThemeToggle target={ref} {...props} />
      <span className="font-mono text-xs opacity-60">{label}</span>
    </div>
  );
}

export default function ThemeToggleSizesDemo() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {tiles.map((tile) => (
        <Tile key={tile.label} {...tile} />
      ))}
    </div>
  );
}
