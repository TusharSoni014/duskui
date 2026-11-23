import { TextAnimate } from "@/components/dusk/text-animate/text-animate";

export default function TextAnimateDemo() {
  return (
    <TextAnimate
      as="h2"
      by="character"
      animation="blurInUp"
      className="text-center text-5xl font-bold tracking-tight sm:text-6xl"
    >
      After hours, on purpose.
    </TextAnimate>
  );
}
