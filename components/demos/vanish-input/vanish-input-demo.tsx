"use client";

import * as React from "react";

import { VanishInput } from "@/components/dusk/vanish-input/vanish-input";

const suggestions = [
  "Ask Dusk to build a pricing page…",
  "Summarize this week's deploys…",
  "Find components that use motion…",
  "Write release notes for v2.0…",
];

export default function VanishInputDemo() {
  const [last, setLast] = React.useState<string | null>(null);

  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-xl border border-white/10 bg-background px-6 py-14">
      <h3 className="text-center text-xl font-semibold tracking-tight text-white">What should we build?</h3>
      <VanishInput placeholders={suggestions} label="Prompt" onSubmit={setLast} />
      <p className="h-5 text-sm text-white/50" aria-live="polite">
        {last ? (
          <>
            Sent: <span className="text-white/80">{last}</span>
          </>
        ) : (
          "Type something and press Enter."
        )}
      </p>
    </div>
  );
}
