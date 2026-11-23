import { IceInput } from "@/components/dusk/glass/ice-input";
import { GlassBackdrop } from "@/components/demos/glass-card/glass-backdrop";

const tones = [
  { label: "Mint", color: "var(--color-primary)" },
  { label: "Lavender", color: "#c4b5fd" },
  { label: "Ember", color: "#fb923c" },
];

export default function IceInputColors() {
  return (
    <>
      <GlassBackdrop />
      <div className="relative grid w-full max-w-xs gap-3">
        {tones.map((tone) => (
          <IceInput key={tone.label} color={tone.color} placeholder={tone.label} aria-label={tone.label} />
        ))}
      </div>
    </>
  );
}
