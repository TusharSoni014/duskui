import { Sparkles } from "lucide-react";
import { ShimmerBadge } from "@/components/dusk/badge/shimmer-badge";

export default function ShimmerBadgeDemo() {
  return (
    <>
      <ShimmerBadge>New</ShimmerBadge>
      <ShimmerBadge variant="default" size="lg">
        <Sparkles />
        Pro
      </ShimmerBadge>
      <ShimmerBadge variant="outline" delay={1}>Beta</ShimmerBadge>
    </>
  );
}
