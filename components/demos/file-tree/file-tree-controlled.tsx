"use client";

import * as React from "react";
import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";

import { FileTree, type FileTreeItem } from "@/components/dusk/file-tree/file-tree";
import { projectFiles } from "@/components/demos/file-tree/project-files";
import { Button } from "@/components/ui/button";

function folderIds(items: FileTreeItem[]): string[] {
  return items.flatMap((item) => (item.children ? [item.id, ...folderIds(item.children)] : []));
}

const allFolders = folderIds(projectFiles);

export default function FileTreeControlled() {
  const [expanded, setExpanded] = React.useState<string[]>(["components"]);

  return (
    <div className="w-full max-w-sm">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-mono text-xs text-white/45">{expanded.length} open</p>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => setExpanded(allFolders)}>
            <ChevronsUpDown aria-hidden /> Expand all
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setExpanded([])}>
            <ChevronsDownUp aria-hidden /> Collapse all
          </Button>
        </div>
      </div>
      <FileTree
        aria-label="Project files"
        items={projectFiles}
        expanded={expanded}
        onExpandedChange={setExpanded}
        className="max-h-80 overflow-y-auto rounded-xl border border-white/10 bg-background p-2"
      />
    </div>
  );
}
