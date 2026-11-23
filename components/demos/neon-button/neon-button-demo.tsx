import { Zap } from "lucide-react";
import { NeonButton } from "@/components/dusk/neon/neon-button";

export default function NeonButtonDemo() {
  return (
    <>
      <NeonButton size="lg">
        <Zap />
        Upgrade
      </NeonButton>
      <NeonButton size="lg" color="#f472b6" flicker>
        Book a table
      </NeonButton>
      <NeonButton size="lg" color="#22d3ee" solid>
        Get started
      </NeonButton>
    </>
  );
}
