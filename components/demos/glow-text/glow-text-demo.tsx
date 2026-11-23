import { GlowText } from "@/components/dusk/neon/glow-text";

export default function GlowTextDemo() {
  return (
    <GlowText
      as="h2"
      color="#ff2bd6"
      animation="flicker"
      className="text-center text-5xl font-bold tracking-tight sm:text-6xl"
    >
      Open all night
    </GlowText>
  );
}
