import { ShineBorder } from "@/components/dusk/shine-border/shine-border";

export default function ShineBorderWidthDemo() {
  return (
    <>
      <ShineBorder radius={9999} duration={5} color={["#fde68a", "#fdba74"]}>
        <span className="block px-4 py-1.5 text-sm font-medium">Now in public beta</span>
      </ShineBorder>
      <ShineBorder borderWidth={2} duration={6} color={["#f9a8d4", "#a5b4fc"]}>
        <div className="px-8 py-6 text-center">
          <p className="text-lg font-semibold">Thicker border</p>
          <p className="text-sm text-white/60">borderWidth 2, duration 6</p>
        </div>
      </ShineBorder>
    </>
  );
}
