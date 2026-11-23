"use client";

import * as React from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MatrixRain } from "@/components/dusk/hacker/matrix-rain";

export default function MatrixRainPausedDemo() {
  const [paused, setPaused] = React.useState(false);

  return (
    <div className="relative h-72 w-full overflow-hidden rounded-lg bg-black">
      <MatrixRain paused={paused} className="opacity-70 [mask-image:linear-gradient(to_bottom,black_60%,transparent)]" />
      <Button
        variant="secondary"
        size="sm"
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
      >
        {paused ? <Play /> : <Pause />}
        {paused ? "Resume" : "Pause"}
      </Button>
    </div>
  );
}
