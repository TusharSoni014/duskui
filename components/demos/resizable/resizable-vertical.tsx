"use client";

import * as React from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export default function ResizableVerticalDemo() {
  const [preview, setPreview] = React.useState(35);

  return (
    <div className="w-full max-w-md space-y-2">
      <ResizablePanelGroup
        orientation="vertical"
        className="min-h-72 rounded-xl border"
        onLayoutChange={(layout) => {
          const size = layout.preview;
          if (typeof size === "number") setPreview(Math.round(size));
        }}
      >
        <ResizablePanel id="editor" defaultSize="65" minSize="25">
          <div className="flex h-full flex-col gap-1.5 p-4 font-mono text-xs text-muted-foreground">
            <span className="text-foreground">## Release notes</span>
            <span>- Drag the divider, or focus it and press ↑ / ↓.</span>
            <span>- Home and End jump to the limits.</span>
          </div>
        </ResizablePanel>
        <ResizableHandle aria-label="Resize preview" />
        <ResizablePanel id="preview" defaultSize="35" minSize="15">
          <div className="flex h-full items-center justify-center bg-white/[0.02] p-4 text-sm text-muted-foreground">
            Preview
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      <p className="text-center text-xs text-muted-foreground tabular-nums">Preview: {preview}%</p>
    </div>
  );
}
