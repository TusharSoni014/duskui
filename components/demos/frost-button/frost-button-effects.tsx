import { Heart, Play, Share2 } from "lucide-react";

import { FrostButton } from "@/components/dusk/glass/frost-button";
import { GlassBackdrop } from "@/components/demos/glass-card/glass-backdrop";

export default function FrostButtonEffects() {
  return (
    <>
      <GlassBackdrop />
      <div className="relative flex flex-col items-center gap-5">
        <div className="flex flex-wrap justify-center gap-3">
          <FrostButton effect="sweep">Sweep only</FrostButton>
          <FrostButton effect="ripple">Ripple only</FrostButton>
          <FrostButton effect="none">No effects</FrostButton>
        </div>
        <div className="flex gap-3">
          <FrostButton size="icon-lg" className="rounded-full" aria-label="Play">
            <Play />
          </FrostButton>
          <FrostButton size="icon-lg" tone="primary" className="rounded-full" aria-label="Like">
            <Heart />
          </FrostButton>
          <FrostButton size="icon-lg" tone="dark" className="rounded-full" aria-label="Share">
            <Share2 />
          </FrostButton>
        </div>
      </div>
    </>
  );
}
