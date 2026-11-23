"use client";

import * as React from "react";
import { Volume1, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function SliderBasicDemo() {
  const [volume, setVolume] = React.useState([60]);

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex items-center justify-between text-sm">
        <span id="volume-label" className="font-medium">Volume</span>
        <span className="text-muted-foreground tabular-nums">{volume[0]}%</span>
      </div>
      <div className="flex items-center gap-3 text-muted-foreground">
        <Volume1 className="size-4 shrink-0" aria-hidden />
        <Slider value={volume} onValueChange={setVolume} max={100} step={1} aria-labelledby="volume-label" />
        <Volume2 className="size-4 shrink-0" aria-hidden />
      </div>
    </div>
  );
}
