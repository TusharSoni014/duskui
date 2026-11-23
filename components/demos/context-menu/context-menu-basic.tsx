"use client";

import * as React from "react";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export default function ContextMenuBasicDemo() {
  const [bookmarks, setBookmarks] = React.useState(true);
  const [fullUrls, setFullUrls] = React.useState(false);
  const [person, setPerson] = React.useState("ada");

  return (
    <ContextMenu>
      <ContextMenuTrigger
        tabIndex={0}
        className="flex h-40 w-full max-w-sm items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground outline-none select-none focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=open]:border-primary/40 data-[state=open]:text-foreground"
      >
        Right-click here (or long-press)
      </ContextMenuTrigger>
      <ContextMenuContent className="w-60">
        <ContextMenuItem inset>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset disabled>
          Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset>
          Reload
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>More tools</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-44">
            <ContextMenuItem>Save page as…</ContextMenuItem>
            <ContextMenuItem>Create shortcut…</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Developer tools</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked={bookmarks} onCheckedChange={setBookmarks}>
          Show bookmarks bar
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem checked={fullUrls} onCheckedChange={setFullUrls}>
          Show full URLs
        </ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuLabel inset>People</ContextMenuLabel>
        <ContextMenuRadioGroup value={person} onValueChange={setPerson}>
          <ContextMenuRadioItem value="ada">Ada Kim</ContextMenuRadioItem>
          <ContextMenuRadioItem value="sam">Sam Patel</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
        <ContextMenuSeparator />
        <ContextMenuItem inset variant="destructive">
          Clear history
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
