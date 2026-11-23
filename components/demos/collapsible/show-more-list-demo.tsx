"use client";

import { ShowMoreList } from "@/components/dusk/collapsible/show-more";

const changes = [
  { version: "2.4.0", note: "Menubar, Drawer and Chart primitives" },
  { version: "2.3.2", note: "Resizable handles glow while dragging" },
  { version: "2.3.1", note: "Collapsible content fades as it opens" },
  { version: "2.3.0", note: "Sheet closes faster than it opens" },
  { version: "2.2.4", note: "Reduced-motion audit across blocks" },
  { version: "2.2.3", note: "Dropdown sub-menus nudge their chevron" },
  { version: "2.2.0", note: "Dialog gets a blurred backdrop" },
];

export default function ShowMoreListDemo() {
  return (
    <div className="w-full max-w-sm">
      <h3 className="mb-2 text-sm font-semibold">Changelog</h3>
      <ShowMoreList
        items={changes}
        initialCount={3}
        getKey={(item) => item.version}
        listClassName="divide-y divide-white/5 rounded-xl border"
        renderItem={(item) => (
          <div className="flex items-center gap-3 px-3 py-2.5 text-sm">
            <span className="rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-primary">{item.version}</span>
            <span className="truncate text-muted-foreground">{item.note}</span>
          </div>
        )}
      />
    </div>
  );
}
