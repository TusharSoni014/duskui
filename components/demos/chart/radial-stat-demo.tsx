import { RadialStat } from "@/components/dusk/chart/radial-stat";

export default function RadialStatDemo() {
  return (
    <div className="grid w-full max-w-xl grid-cols-1 justify-items-center gap-8 sm:grid-cols-3">
      <RadialStat value={72} max={100} label="Storage" unit="GB" />
      <RadialStat value={8_420} max={10_000} label="API calls" color="var(--chart-3)" caption="Resets in 6 days" />
      <RadialStat value={96} max={100} label="Uptime" unit="%" color="var(--chart-4)" caption="Last 30 days" />
    </div>
  );
}
