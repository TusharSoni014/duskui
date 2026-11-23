import { NeonButton } from "@/components/dusk/neon/neon-button";

const colors = ["#f472b6", "#22d3ee", "#facc15", "#a78bfa"];

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
