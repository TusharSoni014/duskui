import { Zap } from "lucide-react";
import { NeonButton } from "@/components/dusk/neon/neon-button";

export default function NeonButtonDemo() {
  return (
    <>
      <NeonButton size="lg">
        <Zap />
        Power up
      </NeonButton>
      <NeonButton size="lg" color="#ff2bd6" flicker>
        Open late
      </NeonButton>
      <NeonButton size="lg" color="#22d3ee" solid>
        Get started
      </NeonButton>
    </>
  );
}
