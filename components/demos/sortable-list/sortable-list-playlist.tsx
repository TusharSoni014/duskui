"use client";

import * as React from "react";

import { SortableList } from "@/components/dusk/sortable-list/sortable-list";

const tracks = [
  { id: "t1", title: "Neon Tide", artist: "Halcyon Drive", seconds: 214, hue: 160 },
  { id: "t2", title: "Glass Avenue", artist: "Mira Vale", seconds: 187, hue: 300 },
  { id: "t3", title: "After Hours", artist: "Static Bloom", seconds: 243, hue: 200 },
  { id: "t4", title: "Low Orbit", artist: "Kepler Kids", seconds: 198, hue: 40 },
];

const format = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function SortableListPlaylistDemo() {
  const [queue, setQueue] = React.useState(tracks);
  const total = queue.reduce((sum, t) => sum + t.seconds, 0);

  return (
    <div className="w-full max-w-sm rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-sm font-semibold">Up next</p>
        <p className="text-xs text-muted-foreground tabular-nums">{format(total)} total</p>
      </div>
      <SortableList
        items={queue}
        onReorder={setQueue}
        getLabel={(t) => `${t.title} by ${t.artist}`}
        label="Play queue"
        itemClassName="py-2"
        renderItem={(track) => (
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="size-9 shrink-0 rounded-md"
              style={{ background: `oklch(0.3 0.04 ${track.hue})` }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{track.title}</p>
              <p className="truncate text-xs text-muted-foreground">{track.artist}</p>
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">{format(track.seconds)}</span>
          </div>
        )}
      />
    </div>
  );
}
