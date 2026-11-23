import { ArrowRight } from "lucide-react";

import { FrostButton } from "@/components/dusk/glass/frost-button";
import { GlassBackdrop } from "@/components/demos/glass-card/glass-backdrop";

export default function FrostButtonDemo() {
  return (
    <>
      <GlassBackdrop />
      <div className="relative flex flex-wrap items-center justify-center gap-3">
        <FrostButton size="lg">
          Get started
          <ArrowRight />
        </FrostButton>
        <FrostButton size="lg" tone="primary">
          Upgrade
        </FrostButton>
        <FrostButton size="lg" tone="dark">
          Learn more
        </FrostButton>
      </div>
    </>
  );
}
