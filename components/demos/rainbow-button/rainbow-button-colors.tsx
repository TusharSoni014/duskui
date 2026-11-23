import { RainbowButton } from "@/components/dusk/rainbow-button/rainbow-button";

export default function RainbowButtonColorsDemo() {
  return (
    <>
      <RainbowButton colors={["#5eead4", "#7dd3fc", "#c4b5fd"]}>
        Cool
      </RainbowButton>
      <RainbowButton colors={["#fda4af", "#fcd34d"]} duration={4}>
        Warm
      </RainbowButton>
      <RainbowButton variant="outline" colors={["#f9a8d4", "#a5b4fc"]} className="rounded-full">
        Pill outline
      </RainbowButton>
    </>
  );
}
