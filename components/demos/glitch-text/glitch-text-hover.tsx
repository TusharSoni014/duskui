import { GlitchText } from "@/components/dusk/hacker/glitch-text";

export default function GlitchTextHoverDemo() {
  return (
    <p className="max-w-md text-center text-lg text-muted-foreground">
      Hover the words{" "}
      <GlitchText className="font-semibold text-foreground">access denied</GlitchText> or{" "}
      <GlitchText className="font-semibold text-primary" intensity={6}>
        kernel panic
      </GlitchText>{" "}
      to glitch them. The text stays selectable.
    </p>
  );
}
