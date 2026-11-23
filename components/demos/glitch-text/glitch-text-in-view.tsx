import { GlitchText } from "@/components/dusk/hacker/glitch-text";

export default function GlitchTextInViewDemo() {
  return (
    <GlitchText
      as="h3"
      trigger="inView"
      duration={700}
      intensity={8}
      colors={["#facc15", "#22d3ee"]}
      className="font-mono text-4xl font-bold tracking-widest"
    >
      {"// SIGNAL LOST"}
    </GlitchText>
  );
}
