import { GlowText } from "@/components/dusk/neon/glow-text";

export default function GlowTextInlineDemo() {
  return (
    <p className="max-w-md text-center text-lg leading-relaxed text-white/70">
      Ship animated interfaces with{" "}
      <GlowText as="strong" intensity={0.7} className="font-semibold">
        DuskUI
      </GlowText>
      . The glow is a plain text-shadow, so the words stay selectable and searchable.
    </p>
  );
}
