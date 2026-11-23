import { AuroraText } from "@/components/dusk/aurora-text/aurora-text";

export default function AuroraTextColors() {
  return (
    <div className="flex flex-col items-center gap-4 text-4xl font-semibold tracking-tight sm:text-5xl">
      <AuroraText as="p" colors={["#fb923c", "#facc15", "#f87171"]}>
        Warm palette
      </AuroraText>
      <AuroraText as="p" colors={["#38bdf8", "#818cf8", "#2dd4bf"]} speed={0.6}>
        Cool palette
      </AuroraText>
      <AuroraText as="p" colors={["var(--color-primary)", "#a3e635", "#34d399"]} speed={1.5}>
        Faster drift
      </AuroraText>
    </div>
  );
}
