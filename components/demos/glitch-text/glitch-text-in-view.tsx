import { GlitchText } from "@/components/dusk/hacker/glitch-text";

export default function GlitchTextInViewDemo() {
  return (
    <GlitchText
      as="h3"
      trigger="inView"
      duration={700}
      intensity={5}
      colors={["#facc15", "#22d3ee"]}
      className="text-4xl font-semibold tracking-tight"
    >
      Connection interrupted
    </GlitchText>
  );
}
