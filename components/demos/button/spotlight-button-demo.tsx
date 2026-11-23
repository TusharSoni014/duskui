import { Github } from "lucide-react";
import { SpotlightButton } from "@/components/dusk/button/spotlight-button";

export default function SpotlightButtonDemo() {
  return (
    <>
      <SpotlightButton size="lg">
        <Github />
        Star on GitHub
      </SpotlightButton>
      <SpotlightButton size="lg" color="#a78bfa" radius={60}>
        Custom color
      </SpotlightButton>
    </>
  );
}
