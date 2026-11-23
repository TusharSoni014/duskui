"use client";

import { Button } from "@/components/ui/button";
import { DotsLoader, PulseLoader, RingLoader } from "@/components/dusk/spinner/loaders";

export default function LoadersInlineDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex items-center gap-3 rounded-xl border bg-card/40 px-4 py-3">
        <span className="grid size-8 place-items-center rounded-full bg-muted text-xs font-medium text-muted-foreground">AI</span>
        <DotsLoader size={28} className="text-muted-foreground" label="Assistant is typing" />
      </div>
      <div className="flex items-center justify-between rounded-xl border bg-card/40 px-4 py-3 text-sm">
        <span className="flex items-center gap-3">
          <PulseLoader size={20} className="text-primary" label="Live" />
          Listening for events
        </span>
        <span className="text-xs text-muted-foreground">live</span>
      </div>
      <Button variant="outline" aria-disabled aria-busy className="self-start">
        <RingLoader size={16} thickness={2} aria-hidden />
        Processing payment
      </Button>
    </div>
  );
}
