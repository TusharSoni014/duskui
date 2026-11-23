"use client";

import * as React from "react";

import { FileTree } from "@/components/dusk/file-tree/file-tree";
import { projectFiles } from "@/components/demos/file-tree/project-files";

export default function FileTreeDemo() {
  const [selected, setSelected] = React.useState<string | null>("app/dashboard/page.tsx");

  return (
    <div className="w-full max-w-sm overflow-hidden rounded-xl border border-white/10 bg-background">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="ml-2 truncate font-mono text-xs text-white/50">{selected ?? "Explorer"}</span>
      </div>
      <FileTree
        aria-label="Project files"
        items={projectFiles}
        defaultExpanded={["app", "app/dashboard", "components"]}
        selected={selected}
        onSelectedChange={(id) => setSelected(id)}
        className="p-2"
      />
    </div>
  );
}
