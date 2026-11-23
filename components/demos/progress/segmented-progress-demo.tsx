"use client";

import * as React from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SegmentedProgress } from "@/components/dusk/progress/segmented-progress";

const total = 8;

export default function SegmentedProgressDemo() {
  const [chunks, setChunks] = React.useState(3);
  const [running, setRunning] = React.useState(false);

  const uploading = running && chunks < total;

  React.useEffect(() => {
    if (!uploading) return;
    const timer = window.setInterval(() => setChunks((c) => Math.min(total, c + 1)), 550);
    return () => window.clearInterval(timer);
  }, [uploading]);

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex items-center justify-between text-sm">
        <span id="segmented-label" className="font-medium">Uploading video.mp4</span>
        <span className="text-muted-foreground tabular-nums">
          {chunks}/{total} chunks
        </span>
      </div>
      <SegmentedProgress value={chunks} max={total} aria-labelledby="segmented-label" />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={() => { setRunning(false); setChunks(0); }}>
          Reset
        </Button>
        <Button
          size="sm"
          variant="outline"
          loading={uploading}
          loadingText="Uploading"
          onClick={() => {
            if (chunks >= total) setChunks(0);
            setRunning(true);
          }}
        >
          <Upload />
          Upload
        </Button>
      </div>
    </div>
  );
}
