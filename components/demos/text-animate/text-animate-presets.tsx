"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";

import { TextAnimate, type TextAnimatePreset } from "@/components/dusk/text-animate/text-animate";

const presets: TextAnimatePreset[] = ["fadeIn", "blurIn", "slideUp", "slideDown", "scaleUp", "blurInUp"];

export default function TextAnimatePresets() {
  const [run, setRun] = React.useState(0);

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-6">
      <div key={run} className="grid w-full gap-x-8 gap-y-5 sm:grid-cols-2">
        {presets.map((preset, i) => (
          <div key={preset}>
            <p className="mb-1 font-mono text-xs text-white/40">{preset}</p>
            <TextAnimate
              animation={preset}
              by={i % 2 ? "character" : "word"}
              trigger="mount"
              className="text-2xl font-semibold tracking-tight"
            >
              Quietly brilliant
            </TextAnimate>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setRun((n) => n + 1)}
        className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white/70 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
      >
        <RotateCcw className="size-3.5" aria-hidden />
        Replay
      </button>
    </div>
  );
}
