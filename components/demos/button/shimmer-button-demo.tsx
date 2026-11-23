import { Sparkles } from "lucide-react";
import { ShimmerButton } from "@/components/dusk/button/shimmer-button";

export default function ShimmerButtonDemo() {
  return (
    <>
      <ShimmerButton size="lg">
        <Sparkles />
        Hover me
      </ShimmerButton>
      <ShimmerButton size="lg" variant="secondary" idle>
        Always shimmering
      </ShimmerButton>
    </>
  );
}
