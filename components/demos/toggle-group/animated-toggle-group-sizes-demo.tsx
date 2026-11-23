import {
  AnimatedToggleGroup,
  AnimatedToggleGroupItem,
} from "@/components/dusk/toggle-group/animated-toggle-group";

const periods = ["1D", "1W", "1M", "1Y", "All"];

export default function AnimatedToggleGroupSizesDemo() {
  return (
    <div className="grid justify-items-center gap-4">
      {(["sm", "default", "lg"] as const).map((size) => (
        <AnimatedToggleGroup key={size} type="single" size={size} defaultValue="1M" aria-label={`Chart range (${size})`}>
          {periods.map((p) => (
            <AnimatedToggleGroupItem key={p} value={p} className="tabular-nums">
              {p}
            </AnimatedToggleGroupItem>
          ))}
        </AnimatedToggleGroup>
      ))}
    </div>
  );
}
