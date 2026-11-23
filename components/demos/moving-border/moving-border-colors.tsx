import { MovingBorder, MovingBorderButton } from "@/components/dusk/moving-border/moving-border";

export default function MovingBorderColorsDemo() {
  return (
    <>
      <MovingBorderButton color="#f9a8d4" speed={3}>
        Faster lap
      </MovingBorderButton>
      <MovingBorderButton color="#7dd3fc" speed={8} beamSize={72}>
        Slower, wider beam
      </MovingBorderButton>
      <MovingBorder radius={9999} color="#fde68a" reverse speed={5} beamSize={40}>
        <span className="block px-4 py-1.5 text-sm font-medium">Counter-clockwise badge</span>
      </MovingBorder>
    </>
  );
}
