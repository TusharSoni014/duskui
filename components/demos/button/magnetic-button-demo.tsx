import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/dusk/button/magnetic-button";

export default function MagneticButtonDemo() {
  return (
    <MagneticButton size="lg" className="rounded-full px-8">
      Get started
      <ArrowRight />
    </MagneticButton>
  );
}
