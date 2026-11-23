"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function ProgressBasicDemo() {
  const [value, setValue] = React.useState(18);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setValue(64), 600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex items-center justify-between text-sm">
        <span id="progress-basic-label" className="font-medium">Syncing files</span>
        <span className="text-muted-foreground tabular-nums">{value}%</span>
      </div>
      <Progress value={value} aria-labelledby="progress-basic-label" />
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => setValue((v) => Math.max(0, v - 15))}>
          −15
        </Button>
        <Button variant="outline" size="sm" onClick={() => setValue((v) => Math.min(100, v + 15))}>
          +15
        </Button>
      </div>
    </div>
  );
}
