import { ArrowRight } from "lucide-react";

import { ShinyText } from "@/components/dusk/text/shiny-text";

export default function ShinyTextHoverDemo() {
  return (
    <a
      href="#hover"
      className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm outline-none transition-colors hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring/60"
    >
      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">New</span>
      <ShinyText trigger="hover" duration={0.9} color="rgb(255 255 255 / 0.7)" shineColor="var(--color-primary)">
        Text effects just landed
      </ShinyText>
      <ArrowRight className="size-3.5 text-white/50 transition-transform group-hover:translate-x-0.5" aria-hidden />
    </a>
  );
}
