import { AuroraText } from "@/components/dusk/aurora-text/aurora-text";

export default function AuroraTextColors() {
  return (
    <div className="flex flex-col items-center gap-4 text-4xl font-bold tracking-tight sm:text-5xl">
      <AuroraText as="p" colors={["#f97316", "#facc15", "#ef4444", "#ec4899"]}>
        Solar flare
      </AuroraText>
      <AuroraText as="p" colors={["#38bdf8", "#818cf8", "#2dd4bf"]} speed={0.6}>
        Deep current
      </AuroraText>
      <AuroraText as="p" colors={["var(--color-primary)", "#bef264", "#34d399"]} speed={1.8}>
        Mint rush
      </AuroraText>
    </div>
  );
}
