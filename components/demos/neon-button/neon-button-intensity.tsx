import { NeonButton } from "@/components/dusk/neon/neon-button";

export default function NeonButtonIntensityDemo() {
  return (
    <>
      <NeonButton intensity={0.5}>Subtle</NeonButton>
      <NeonButton>Default</NeonButton>
      <NeonButton intensity={0}>No glow</NeonButton>
      <NeonButton solid>
        Solid tube
      </NeonButton>
    </>
  );
}
