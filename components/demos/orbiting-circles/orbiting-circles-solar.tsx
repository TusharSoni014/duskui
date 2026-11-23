import { OrbitingCircles } from "@/components/dusk/orbiting-circles/orbiting-circles";

const planet = "size-full rounded-full";

export default function OrbitingCirclesSolar() {
  return (
    <div className="relative flex h-96 w-full items-center justify-center overflow-hidden">
      <div aria-hidden className="relative z-10 size-12 rounded-full bg-amber-300" />
      <OrbitingCircles radius={50} duration={6} iconSize={10} startAngle={20} aria-hidden>
        <span className={`${planet} bg-stone-300`} />
      </OrbitingCircles>
      <OrbitingCircles radius={85} duration={11} iconSize={16} startAngle={200} aria-hidden>
        <span className={`${planet} bg-sky-400`} />
      </OrbitingCircles>
      <OrbitingCircles radius={125} duration={19} iconSize={14} startAngle={110} aria-hidden>
        <span className={`${planet} bg-orange-400`} />
      </OrbitingCircles>
      <OrbitingCircles radius={170} duration={34} iconSize={26} startAngle={300} pathClassName="border-dashed" aria-hidden>
        <span className={`${planet} bg-amber-200`} />
      </OrbitingCircles>
    </div>
  );
}
