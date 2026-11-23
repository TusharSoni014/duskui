import { MorphingText } from "@/components/dusk/morphing-text/morphing-text";

export default function MorphingTextHeadlineDemo() {
  return (
    <h2 className="max-w-lg text-center text-3xl font-semibold tracking-tight sm:text-4xl">
      Interfaces that feel{" "}
      <MorphingText
        words={["alive", "fluid", "effortless", "yours"]}
        align="start"
        interval={2600}
        className="text-primary"
      />
    </h2>
  );
}
