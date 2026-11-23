"use client";

import * as React from "react";

import { VanishInput } from "@/components/dusk/vanish-input/vanish-input";

export default function VanishInputSearch() {
  const [history, setHistory] = React.useState<string[]>([]);

  return (
    <div className="flex w-full flex-col items-center gap-5 rounded-xl border border-white/10 bg-background px-6 py-10">
      <VanishInput
        placeholders={["Search docs", "Try “globe”", "Try “countdown”", "Try “card stack”"]}
        interval={2200}
        label="Search docs"
        submitLabel="Search"
        containerClassName="max-w-md"
        className="h-11 rounded-md text-sm"
        onSubmit={(q) => setHistory((h) => [q, ...h].slice(0, 4))}
      />
      <ul className="flex min-h-7 flex-wrap justify-center gap-2" aria-label="Recent searches">
        {history.map((q, i) => (
          <li key={`${q}-${history.length - i}`} className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-white/70">
            {q}
          </li>
        ))}
      </ul>
    </div>
  );
}
