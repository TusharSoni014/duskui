"use client";

import * as React from "react";
import { Bug, Rocket, ShieldCheck, Sparkles, Zap } from "lucide-react";

import { SortableList } from "@/components/dusk/sortable-list/sortable-list";

const initial = [
  { id: "launch", title: "Ship the launch page", meta: "Marketing · Fri", icon: Rocket },
  { id: "auth", title: "Rotate auth secrets", meta: "Security · Today", icon: ShieldCheck },
  { id: "perf", title: "Cut cold start under 200 ms", meta: "Platform · Next week", icon: Zap },
  { id: "bug", title: "Fix flaky checkout test", meta: "QA · Tomorrow", icon: Bug },
  { id: "polish", title: "Polish onboarding motion", meta: "Design · Backlog", icon: Sparkles },
];

export default function SortableListDemo() {
  const [items, setItems] = React.useState(initial);

  return (
    <div className="w-full max-w-sm">
      <p className="mb-3 text-sm font-medium">Priorities</p>
      <SortableList
        items={items}
        onReorder={setItems}
        getLabel={(item) => item.title}
        label="Priorities"
        renderItem={(item, { index, active }) => {
          const Icon = item.icon;
          return (
            <div className="flex items-center gap-3">
              <span
                className={
                  active
                    ? "grid size-8 shrink-0 place-items-center rounded-md bg-accent text-foreground"
                    : "grid size-8 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground"
                }
              >
                <Icon aria-hidden className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{item.title}</p>
                <p className="truncate text-xs text-muted-foreground">{item.meta}</p>
              </div>
              <span className="text-xs text-muted-foreground tabular-nums">#{index + 1}</span>
            </div>
          );
        }}
      />
    </div>
  );
}
