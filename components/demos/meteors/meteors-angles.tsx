import { Meteors } from "@/components/dusk/backgrounds/meteors";

const skies = [
  { label: "angle={100}", props: { angle: 100, color: "#38bdf8", count: 14, seed: 3 } },
  { label: "angle={200}", props: { angle: 200, color: "#f472b6", tailLength: 160, seed: 8 } },
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
