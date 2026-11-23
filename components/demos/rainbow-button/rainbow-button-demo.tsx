import { ArrowRight, Github } from "lucide-react";
import { RainbowButton } from "@/components/dusk/rainbow-button/rainbow-button";

export default function RainbowButtonDemo() {
  return (
    <>
      <RainbowButton size="lg">
        Get started
        <ArrowRight />
      </RainbowButton>
      <RainbowButton size="lg" variant="outline">
        <Github />
        Star on GitHub
      </RainbowButton>
    </>
  );
}
