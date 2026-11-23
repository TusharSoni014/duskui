import { ArrowRight } from "lucide-react";

import { BlurFade, BlurFadeGroup } from "@/components/dusk/blur-fade/blur-fade";

export default function BlurFadeDemo() {
  return (
    <div className="w-full max-w-lg text-center">
      <BlurFadeGroup stagger={0.1} className="flex flex-col items-center gap-4">
        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
          v2.0 is live
        </span>
        <h3 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Ship interfaces that feel alive
        </h3>
        <p className="max-w-sm text-balance text-sm leading-relaxed text-white/60">
          Every block fades in from a soft blur as it enters the screen, staggered so the eye reads it
          top to bottom.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Get started <ArrowRight className="size-4" aria-hidden />
          </button>
          <button type="button" className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white/80">
            Docs
          </button>
        </div>
      </BlurFadeGroup>
      <BlurFade delay={0.55} blur={12} className="mt-8 font-mono text-xs text-white/35">
        Press replay ↻ to watch it again
      </BlurFade>
    </div>
  );
}
