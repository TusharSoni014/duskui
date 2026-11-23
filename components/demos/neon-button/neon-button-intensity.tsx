import { NeonButton } from "@/components/dusk/neon/neon-button";

export default function NeonButtonIntensityDemo() {
  return (
    <>
      <NeonButton intensity={0.5}>Subtle</NeonButton>
      <NeonButton>Default</NeonButton>
      <NeonButton intensity={1.8}>Blazing</NeonButton>
      <NeonButton intensity={1.4} solid>
        Solid tube
      </NeonButton>
    </>
  );
}
