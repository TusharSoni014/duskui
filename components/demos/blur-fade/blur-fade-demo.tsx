import { ArrowRight } from "lucide-react";

import { BlurFade, BlurFadeGroup } from "@/components/dusk/blur-fade/blur-fade";

export default function BlurFadeDemo() {
  return (
    <div className="w-full max-w-lg text-center">
      <BlurFadeGroup stagger={0.1} className="flex flex-col items-center gap-4">
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
          Changelog
        </span>
        <h3 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Release notes your team will read
        </h3>
        <p className="max-w-sm text-balance text-sm leading-relaxed text-white/60">
          Draft updates from merged pull requests, review them together and publish to your site in one
          step.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Get started <ArrowRight className="size-4" aria-hidden />
          </button>
          <button type="button" className="rounded-md border border-white/15 px-4 py-2 text-sm font-medium text-white/80">
            Docs
          </button>
        </div>
      </BlurFadeGroup>
      <BlurFade delay={0.55} className="mt-8 text-xs text-white/40">
        Press replay to watch it again
      </BlurFade>
    </div>
  );
}
