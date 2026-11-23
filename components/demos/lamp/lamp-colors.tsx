import { Lamp } from "@/components/dusk/lamp/lamp";

const lamps = [
  { label: 'color="#7dd3fc"', props: { color: "#7dd3fc" } },
  { label: 'color="#c4b5fd" spread={34}', props: { color: "#c4b5fd", spread: 34 } },
];

export default function LampColors() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {lamps.map((lamp) => (
        <Lamp key={lamp.label} offset={64} className="min-h-64 rounded-xl border border-white/10 px-4 pb-8" {...lamp.props}>
          <p className="text-2xl font-semibold tracking-tight text-white">Release notes</p>
          <span className="mt-2 font-mono text-xs text-white/60">{lamp.label}</span>
        </Lamp>
      ))}
    </div>
  );
}
