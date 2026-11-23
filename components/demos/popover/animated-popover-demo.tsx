"use client";

import * as React from "react";
import { Check, Copy, Link2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AnimatedPopover,
  AnimatedPopoverContent,
  AnimatedPopoverTrigger,
} from "@/components/dusk/popover/animated-popover";

const link = "https://duskui.com/s/aurora";

export default function AnimatedPopoverDemo() {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <AnimatedPopover>
      <AnimatedPopoverTrigger asChild>
        <Button>
          <Share2 />
          Share
        </Button>
      </AnimatedPopoverTrigger>
      <AnimatedPopoverContent showArrow className="w-80">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Link2 className="size-4" aria-hidden />
          </span>
          <div>
            <h4 className="text-sm font-medium">Share this project</h4>
            <p className="text-sm text-muted-foreground">Anyone with the link can view.</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Input readOnly value={link} aria-label="Share link" className="h-8 font-mono text-xs" />
          <Button
            size="icon-sm"
            variant="outline"
            aria-label={copied ? "Copied" : "Copy link"}
            onClick={() => {
              void navigator.clipboard?.writeText(link);
              setCopied(true);
            }}
          >
            {copied ? <Check className="text-primary" /> : <Copy />}
          </Button>
        </div>
      </AnimatedPopoverContent>
    </AnimatedPopover>
  );
}
