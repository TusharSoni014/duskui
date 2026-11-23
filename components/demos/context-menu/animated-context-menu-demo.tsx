"use client";

import * as React from "react";
import { Copy, Download, FileImage, FolderInput, Link2, Pencil, Share2, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AnimatedContextMenu,
  AnimatedContextMenuCheckboxItem,
  AnimatedContextMenuContent,
  AnimatedContextMenuItem,
  AnimatedContextMenuLabel,
  AnimatedContextMenuRadioGroup,
  AnimatedContextMenuRadioItem,
  AnimatedContextMenuSeparator,
  AnimatedContextMenuSub,
  AnimatedContextMenuSubContent,
  AnimatedContextMenuSubTrigger,
  AnimatedContextMenuTrigger,
} from "@/components/dusk/context-menu/animated-context-menu";

export default function AnimatedContextMenuDemo() {
  const [starred, setStarred] = React.useState(false);
  const [view, setView] = React.useState("grid");

  return (
    <AnimatedContextMenu>
      <AnimatedContextMenuTrigger
        tabIndex={0}
        className="group flex w-full max-w-sm flex-col items-center gap-3 rounded-2xl border border-dashed p-8 text-center outline-none select-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=open]:border-primary/40 data-[state=open]:bg-primary/[0.03]"
      >
        <span className="flex size-14 items-center justify-center rounded-xl border bg-card text-muted-foreground transition-colors group-data-[state=open]:text-primary">
          <FileImage className="size-6" aria-hidden />
        </span>
        <span>
          <span className="block text-sm font-medium">aurora-hero.png</span>
          <span className="block text-xs text-muted-foreground">Right-click anywhere in this box</span>
        </span>
      </AnimatedContextMenuTrigger>
      <AnimatedContextMenuContent className="w-60">
        <AnimatedContextMenuLabel>aurora-hero.png</AnimatedContextMenuLabel>
        <AnimatedContextMenuItem icon={<Pencil />} shortcut="F2" onSelect={() => toast("Renaming…")}>
          Rename
        </AnimatedContextMenuItem>
        <AnimatedContextMenuItem icon={<Copy />} shortcut="⌘D" onSelect={() => toast("Duplicated")}>
          Duplicate
        </AnimatedContextMenuItem>
        <AnimatedContextMenuSub>
          <AnimatedContextMenuSubTrigger icon={<Share2 />}>Share</AnimatedContextMenuSubTrigger>
          <AnimatedContextMenuSubContent>
            <AnimatedContextMenuItem icon={<Link2 />} onSelect={() => toast("Link copied")}>
              Copy link
            </AnimatedContextMenuItem>
            <AnimatedContextMenuItem icon={<Download />} onSelect={() => toast("Downloading…")}>
              Download
            </AnimatedContextMenuItem>
            <AnimatedContextMenuItem icon={<FolderInput />} onSelect={() => toast("Moved")}>
              Move to…
            </AnimatedContextMenuItem>
          </AnimatedContextMenuSubContent>
        </AnimatedContextMenuSub>
        <AnimatedContextMenuSeparator />
        <AnimatedContextMenuCheckboxItem
          checked={starred}
          onCheckedChange={setStarred}
          onSelect={(event) => event.preventDefault()}
        >
          <span className="flex items-center gap-2">
            Starred
            <Star className={starred ? "size-3.5 fill-primary text-primary" : "size-3.5 text-muted-foreground"} aria-hidden />
          </span>
        </AnimatedContextMenuCheckboxItem>
        <AnimatedContextMenuSeparator />
        <AnimatedContextMenuLabel>View as</AnimatedContextMenuLabel>
        <AnimatedContextMenuRadioGroup value={view} onValueChange={setView}>
          <AnimatedContextMenuRadioItem value="grid" onSelect={(event) => event.preventDefault()}>
            Grid
          </AnimatedContextMenuRadioItem>
          <AnimatedContextMenuRadioItem value="list" onSelect={(event) => event.preventDefault()}>
            List
          </AnimatedContextMenuRadioItem>
        </AnimatedContextMenuRadioGroup>
        <AnimatedContextMenuSeparator />
        <AnimatedContextMenuItem icon={<Trash2 />} shortcut="⌫" variant="destructive" onSelect={() => toast.error("Moved to trash")}>
          Move to trash
        </AnimatedContextMenuItem>
      </AnimatedContextMenuContent>
    </AnimatedContextMenu>
  );
}
