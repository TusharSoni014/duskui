import { MatrixRain } from "@/components/dusk/hacker/matrix-rain";

export default function MatrixRainDemo() {
  return (
    <div className="relative h-80 w-full overflow-hidden rounded-lg bg-black">
      <MatrixRain />
      <div className="relative flex h-full items-center justify-center bg-[radial-gradient(ellipse_at_center,rgb(0_0_0/0.75),transparent_70%)]">
        <h3 className="font-mono text-3xl font-bold tracking-widest text-white">WAKE UP, NEO</h3>
      </div>
    </div>
  );
}
