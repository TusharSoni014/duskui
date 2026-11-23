import { ArrowRight } from "lucide-react";
import { MovingBorderButton } from "@/components/dusk/moving-border/moving-border";

export default function MovingBorderDemo() {
  return (
    <>
      <MovingBorderButton size="lg">
        Book a demo
        <ArrowRight />
      </MovingBorderButton>
      <MovingBorderButton size="lg" color="#c4b5fd" radius={8}>
        Rounded corners
      </MovingBorderButton>
    </>
  );
}
