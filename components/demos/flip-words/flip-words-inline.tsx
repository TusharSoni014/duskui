import { FlipWords } from "@/components/dusk/flip-words/flip-words";

export default function FlipWordsInline() {
  return (
    <p className="max-w-md text-center text-lg leading-relaxed text-white/65">
      The sentence around the word glides as the width springs from{" "}
      <FlipWords words={["short", "much, much longer", "medium"]} className="font-semibold text-white" /> and back.
      Hover it to pause.
    </p>
  );
}
