import { SparklesText } from "@/components/dusk/sparkles-text/sparkles-text";

export default function SparklesTextColors() {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <SparklesText as="p" colors={["#facc15", "#fde68a"]} seed={3} className="text-4xl font-semibold text-amber-100">
        Golden hour
      </SparklesText>
      <SparklesText as="p" colors={["#f472b6", "#a78bfa", "#22d3ee"]} seed={21} className="text-4xl font-semibold text-white">
        Cotton candy
      </SparklesText>
    </div>
  );
}
