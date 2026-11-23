import { GlowText } from "@/components/dusk/neon/glow-text";

export default function GlowTextAnimationsDemo() {
  return (
    <div className="grid gap-6 text-center sm:grid-cols-3">
      <GlowText as="p" animation="none" className="text-3xl font-semibold">
        Static
      </GlowText>
      <GlowText as="p" animation="breathe" className="text-3xl font-semibold">
        Breathe
      </GlowText>
      <GlowText as="p" animation="flicker" className="text-3xl font-semibold">
        Flicker
      </GlowText>
    </div>
  );
}
