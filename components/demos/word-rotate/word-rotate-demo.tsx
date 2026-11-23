import { WordRotate } from "@/components/dusk/text/word-rotate";

export default function WordRotateDemo() {
  return (
    <h2 className="text-center text-4xl font-bold tracking-tight sm:text-5xl">
      Interfaces for{" "}
      <WordRotate words={["founders", "developers", "designers", "night owls"]} className="text-white/60" />
    </h2>
  );
}
