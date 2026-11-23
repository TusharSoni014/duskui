import { NeonBorder } from "@/components/dusk/neon/neon-border";

export default function NeonBorderTwoToneDemo() {
  return (
    <>
      <NeonBorder color="#f472b6" secondaryColor="#22d3ee" thickness={2} glow={1} speed={4}>
        <div className="rounded-[inherit] bg-card px-8 py-6 text-center">
          <p className="text-lg font-semibold">Two-tone</p>
          <p className="text-sm text-white/60">A second color and a 2px border</p>
        </div>
      </NeonBorder>
      <NeonBorder radius={9999} glow={0} speed={4} color="#facc15">
        <span className="block rounded-full bg-card px-4 py-1.5 text-sm font-medium">Version 2.0 is out</span>
      </NeonBorder>
    </>
  );
}
