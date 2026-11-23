import { ShimmerBadge } from "@/components/dusk/badge/shimmer-badge";

export default function ShimmerBadgeDemo() {
  return (
    <>
      <ShimmerBadge>New</ShimmerBadge>
      <ShimmerBadge variant="default" size="lg">Pro</ShimmerBadge>
      <ShimmerBadge variant="outline">Beta</ShimmerBadge>
    </>
  );
}
