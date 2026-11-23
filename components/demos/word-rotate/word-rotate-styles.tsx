import { WordRotate } from "@/components/dusk/text/word-rotate";

export default function WordRotateStylesDemo() {
  return (
    <div className="grid gap-8 text-center text-3xl font-semibold tracking-tight">
      <p>
        Pure blur{" "}
        <WordRotate
          words={["swap", "fade", "melt"]}
          distance={0}
          blur={10}
          interval={2000}
          className="text-[#22d3ee]"
        />
      </p>
      <p>
        Make it{" "}
        <WordRotate
          words={["clear", "quiet", "fast", "yours"]}
          interval={1800}
          wordClassName="text-white/60"
        />
      </p>
      <p className="font-serif text-4xl italic">
        <WordRotate words={["Slow", "Steady", "Smooth"]} interval={3200} distance={1} blur={0} />{" "}
        and calm.
      </p>
    </div>
  );
}
