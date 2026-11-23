import { Highlighter, type HighlighterAction } from "@/components/dusk/highlighter/highlighter";

const actions: { action: HighlighterAction; label: string }[] = [
  { action: "highlight", label: "Marker highlight" },
  { action: "underline", label: "Hand-drawn underline" },
  { action: "circle", label: "Circled for emphasis" },
  { action: "strike-through", label: "Struck through" },
  { action: "box", label: "Boxed in" },
];

export default function HighlighterActions() {
  return (
    <ul className="grid gap-5 text-xl font-medium text-white/80 sm:grid-cols-2">
      {actions.map(({ action, label }) => (
        <li key={action} className="flex flex-col gap-1">
          <span className="font-mono text-xs text-white/55">{action}</span>
          <span>
            <Highlighter action={action} duration={0.7}>
              {label}
            </Highlighter>
          </span>
        </li>
      ))}
    </ul>
  );
}
