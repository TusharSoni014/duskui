import { NeonBorder } from "@/components/dusk/neon/neon-border";

export default function NeonBorderTwoToneDemo() {
  return (
    <>
      <NeonBorder color="#ff2bd6" secondaryColor="#22d3ee" thickness={3} glow={1.5} speed={3}>
        <div className="rounded-[inherit] bg-card px-8 py-6 text-center">
          <p className="text-lg font-semibold">Synthwave</p>
          <p className="text-sm text-white/60">Two-tone beam, thicker tube</p>
        </div>
      </NeonBorder>
      <NeonBorder radius={9999} thickness={1} glow={0.6} speed={2} color="#facc15">
        <span className="block rounded-full bg-card px-4 py-1.5 text-sm font-medium">New: v2.0 is live</span>
      </NeonBorder>
    </>
  );
}
