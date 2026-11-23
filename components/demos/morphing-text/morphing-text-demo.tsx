import { MorphingText } from "@/components/dusk/morphing-text/morphing-text";

export default function MorphingTextDemo() {
  return (
    <MorphingText
      as="p"
      words={["Dusk", "Neon", "Motion", "Glow", "Flow"]}
      className="text-6xl font-bold tracking-tight text-primary sm:text-7xl"
    />
  );
}
