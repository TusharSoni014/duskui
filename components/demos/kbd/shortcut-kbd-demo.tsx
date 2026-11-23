"use client";

import * as React from "react";
import { ShortcutKbd } from "@/components/dusk/kbd/shortcut-kbd";

export default function ShortcutKbdDemo() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      {/* ⌘K is taken by this site's search, so the demo listens for ⌘J / Ctrl+J. */}
      <ShortcutKbd keys={["mod", "j"]} size="lg" onTrigger={() => setCount((c) => c + 1)} />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {count === 0 ? "Press the shortcut — each key lights up as you hold it." : `Shortcut fired ${count} ${count === 1 ? "time" : "times"}.`}
      </p>
    </div>
  );
}
