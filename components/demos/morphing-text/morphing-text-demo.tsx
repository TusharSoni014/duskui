import { MorphingText } from "@/components/dusk/morphing-text/morphing-text";

export default function MorphingTextDemo() {
  return (
    <MorphingText
      as="p"
      words={["Design", "Prototype", "Build", "Ship"]}
      className="text-6xl font-semibold tracking-tight text-white sm:text-7xl"
    />
  );
}
