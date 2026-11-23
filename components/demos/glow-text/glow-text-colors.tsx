import { GlowText } from "@/components/dusk/neon/glow-text";

export default function GlowTextColorsDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-4xl font-bold">
      <GlowText color="#22d3ee">Cyan</GlowText>
      <GlowText color="#facc15" intensity={1.3}>
        Amber
      </GlowText>
      <GlowText color="#a78bfa" className="font-serif italic">
        Violet
      </GlowText>
      <GlowText color="oklch(0.7 0.25 25)" intensity={0.6} animation="none">
        Ember
      </GlowText>
    </div>
  );
}
