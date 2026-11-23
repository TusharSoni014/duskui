import { Github } from "lucide-react";
import { SpotlightButton } from "@/components/dusk/button/spotlight-button";

export default function SpotlightButtonDemo() {
  return (
    <>
      <SpotlightButton size="lg">
        <Github />
        Star on GitHub
      </SpotlightButton>
      <SpotlightButton size="lg" radius={48}>
        Read the docs
      </SpotlightButton>
    </>
  );
}
