import { WordRotate } from "@/components/dusk/text/word-rotate";

export default function WordRotatePoliteDemo() {
  return (
    <p className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70">
      <span className="size-2 rounded-full bg-emerald-400" aria-hidden />
      Edge cache warm in{" "}
      <WordRotate
        announce="polite"
        words={["Frankfurt", "Tokyo", "São Paulo", "Virginia", "Sydney"]}
        interval={2600}
        className="font-medium text-foreground"
      />
    </p>
  );
}
