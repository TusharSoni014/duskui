import { ShineBorder } from "@/components/dusk/shine-border/shine-border";

const cards = [
  { title: "Mint", color: "var(--color-primary)" },
  { title: "Warm", color: ["#fda4af", "#fcd34d"] },
  { title: "Cool", color: ["#7dd3fc", "#c4b5fd"] },
];

export default function ShineBorderColorsDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <ShineBorder key={card.title} color={card.color} contentClassName="p-5">
          <p className="font-semibold">{card.title}</p>
          <p className="mt-1 text-sm text-white/60">
            {Array.isArray(card.color) ? `${card.color.length} colors` : "Single color"}
          </p>
        </ShineBorder>
      ))}
    </div>
  );
}
