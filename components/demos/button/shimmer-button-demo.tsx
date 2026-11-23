import { ShimmerButton } from "@/components/dusk/button/shimmer-button";

export default function ShimmerButtonDemo() {
  return (
    <>
      <ShimmerButton size="lg">Upgrade to Pro</ShimmerButton>
      <ShimmerButton size="lg" variant="secondary" idle>
        Start free trial
      </ShimmerButton>
    </>
  );
}
