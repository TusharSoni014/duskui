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
          words={["glow", "shimmer", "flicker", "pulse"]}
          interval={1800}
          wordClassName="bg-linear-to-r from-primary to-[#22d3ee] bg-clip-text text-transparent"
        />
      </p>
      <p className="font-serif text-4xl italic">
        <WordRotate words={["Slow", "Steady", "Smooth"]} interval={3200} distance={1} blur={0} />{" "}
        and calm.
      </p>
    </div>
  );
}
