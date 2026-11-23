import { GlitchText } from "@/components/dusk/hacker/glitch-text";

export default function GlitchTextDemo() {
  return (
    <GlitchText
      as="h2"
      trigger="loop"
      interval={2600}
      className="font-mono text-5xl font-black uppercase tracking-tight sm:text-6xl"
    >
      System Breach
    </GlitchText>
  );
}
