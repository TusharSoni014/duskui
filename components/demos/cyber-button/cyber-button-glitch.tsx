import { CyberButton } from "@/components/dusk/hacker/cyber-button";

export default function CyberButtonGlitchDemo() {
  return (
    <>
      <CyberButton effect="glitch" size="lg">
        Override
      </CyberButton>
      <CyberButton effect="glitch" variant="outline" size="lg">
        Bypass firewall
      </CyberButton>
    </>
  );
}
