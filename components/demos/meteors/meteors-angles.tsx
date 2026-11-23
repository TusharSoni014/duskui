import { Meteors } from "@/components/dusk/backgrounds/meteors";

const skies = [
  { label: "angle={100}", props: { angle: 100, color: "rgb(125 211 252 / 0.7)", seed: 3 } },
  { label: "angle={200}", props: { angle: 200, tailLength: 140, seed: 8 } },
];

export default function MeteorsAngles() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {skies.map((sky) => (
        <div
          key={sky.label}
          className="relative flex h-56 items-end overflow-hidden rounded-xl border border-white/10 bg-background p-4"
        >
          <Meteors {...sky.props} />
          <span className="relative font-mono text-xs text-white/70">{sky.label}</span>
        </div>
      ))}
    </div>
  );
}
