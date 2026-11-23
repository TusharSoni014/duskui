import { NeonButton } from "@/components/dusk/neon/neon-button";

const colors = ["#ff2bd6", "#22d3ee", "#facc15", "#a78bfa", "oklch(0.7 0.25 25)"];

export default function NeonButtonColorsDemo() {
  return (
    <>
      {colors.map((color) => (
        <NeonButton key={color} color={color}>
          Neon
        </NeonButton>
      ))}
    </>
  );
}
