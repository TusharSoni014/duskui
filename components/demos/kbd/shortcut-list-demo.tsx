"use client";

import * as React from "react";
import { ShortcutKbd } from "@/components/dusk/kbd/shortcut-kbd";
import { cn } from "@/lib/utils";

const shortcuts = [
  { label: "Next item", keys: ["j"] },
  { label: "Previous item", keys: ["k"] },
  { label: "Focus filter", keys: ["/"] },
  { label: "New note", keys: ["alt", "n"] },
  { label: "Show shortcuts", keys: ["?"] },
];

export default function ShortcutListDemo() {
  const [last, setLast] = React.useState<string | null>(null);

  return (
    <div className="w-full max-w-sm">
      <ul className="divide-y divide-white/5 rounded-xl border bg-card/40">
        {shortcuts.map((shortcut) => (
          <li
            key={shortcut.label}
            className={cn(
              "flex items-center justify-between px-4 py-2.5 text-sm transition-colors duration-200",
              last === shortcut.label && "bg-white/[0.03] text-foreground"
            )}
          >
            {shortcut.label}
            <ShortcutKbd keys={shortcut.keys} onTrigger={() => setLast(shortcut.label)} />
          </li>
        ))}
      </ul>
      <p className="mt-3 text-center text-xs text-muted-foreground" aria-live="polite">
        {last ? `Last shortcut: ${last}` : "Try the keys (they pause while you type in a field)."}
      </p>
    </div>
  );
}
