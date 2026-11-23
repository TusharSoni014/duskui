"use client";

import * as React from "react";
import { Check, RotateCcw, X } from "lucide-react";

import { CardStack, type SwipeDirection } from "@/components/dusk/card-stack/card-stack";

const features = [
  { title: "Dark mode scheduling", detail: "Switch themes at sunset automatically." },
  { title: "Offline drafts", detail: "Keep writing on the train; sync when you're back." },
  { title: "Shared workspaces", detail: "Invite your team and edit together in real time." },
  { title: "Command palette", detail: "Every action, two keystrokes away." },
  { title: "Weekly digest", detail: "A Monday email with what changed last week." },
];

type Decision = { title: string; direction: SwipeDirection };

export default function CardStackDecisions() {
  const [decisions, setDecisions] = React.useState<Decision[]>([]);
  const [round, setRound] = React.useState(0);

  return (
    <div className="grid w-full gap-8 rounded-xl border border-white/10 bg-background p-6 sm:grid-cols-[1fr_200px] sm:p-10">
      <CardStack
        // A new key starts a fresh stack.
        key={round}
        items={features}
        loop={false}
        visible={4}
        offset={10}
        label="Feature voting"
        labels={{ left: "Skip", right: "Want it" }}
        className="mx-auto"
        cardClassName="p-5"
        onSwipe={(direction, item) => setDecisions((d) => [...d, { title: item.title, direction }])}
        empty={
          <span className="flex flex-col items-center gap-3">
            Thanks for voting.
            <button
              type="button"
              onClick={() => {
                setDecisions([]);
                setRound((r) => r + 1);
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 text-xs text-white transition-colors hover:border-white/20 hover:bg-white/[0.04]"
            >
              <RotateCcw className="size-3.5" /> Vote again
            </button>
          </span>
        }
        renderItem={(f) => (
          <div className="flex h-36 flex-col justify-between">
            <p className="text-sm text-white/50">Would you use this?</p>
            <div>
              <p className="text-lg font-semibold text-white">{f.title}</p>
              <p className="mt-1 text-sm text-white/60">{f.detail}</p>
            </div>
          </div>
        )}
      />
      <div>
        <p className="text-sm font-medium text-white">Your votes</p>
        <ul className="mt-3 space-y-2 text-sm">
          {decisions.length === 0 && <li className="text-white/40">Swipe, click or use ← →</li>}
          {decisions.map((d) => (
            <li key={d.title} className="flex items-center gap-2 text-white/70">
              {d.direction === "right" ? (
                <Check aria-label="Want it" className="size-4 text-foreground" />
              ) : (
                <X aria-label="Skip" className="size-4 text-white/40" />
              )}
              {d.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
