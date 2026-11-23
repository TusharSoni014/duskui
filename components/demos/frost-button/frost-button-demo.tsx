import { ArrowRight, Sparkles } from "lucide-react";

import { FrostButton } from "@/components/dusk/glass/frost-button";
import { GlassBackdrop } from "@/components/demos/glass-card/glass-backdrop";

export default function FrostButtonDemo() {
  return (
    <>
      <GlassBackdrop />
      <div className="relative flex flex-wrap items-center justify-center gap-3">
        <FrostButton size="lg" className="rounded-full">
          Get started
          <ArrowRight />
        </FrostButton>
        <FrostButton size="lg" tone="primary" className="rounded-full">
          <Sparkles />
          Upgrade
        </FrostButton>
        <FrostButton size="lg" tone="dark" className="rounded-full">
          Learn more
        </FrostButton>
      </div>
    </>
  );
}
