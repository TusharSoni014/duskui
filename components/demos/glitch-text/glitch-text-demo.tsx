import { GlitchText } from "@/components/dusk/hacker/glitch-text";

export default function GlitchTextDemo() {
  return (
    <GlitchText
      as="h2"
      trigger="loop"
      interval={3200}
      className="text-5xl font-bold tracking-tight sm:text-6xl"
    >
      Signal lost
    </GlitchText>
  );
}
