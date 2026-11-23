"use client";

import * as React from "react";
import { Slider } from "@/components/ui/slider";

export default function SliderRangeDemo() {
  const [range, setRange] = React.useState([25, 75]);

  return (
    <div className="flex w-full max-w-md items-center gap-10">
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Price</span>
          <span className="text-muted-foreground tabular-nums">
            ${range[0]} – ${range[1]}
          </span>
        </div>
        <Slider value={range} onValueChange={setRange} max={100} step={5} minStepsBetweenThumbs={1} aria-label="Price" />
      </div>
      <Slider defaultValue={[40]} orientation="vertical" aria-label="Brightness" className="h-32" />
    </div>
  );
}
