import { Zap } from "lucide-react";
import { CyberButton } from "@/components/dusk/hacker/cyber-button";

export default function CyberButtonDemo() {
  return (
    <>
      <CyberButton size="lg">
        <Zap />
        Jack in
      </CyberButton>
      <CyberButton size="lg" variant="outline">
        Hack the planet
      </CyberButton>
    </>
  );
}
