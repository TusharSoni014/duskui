"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  useChartReducedMotion,
  type ChartConfig,
} from "@/components/ui/chart";

const data = [
  { week: "W1", p50: 120, p95: 310 },
  { week: "W2", p50: 112, p95: 284 },
  { week: "W3", p50: 128, p95: 352 },
  { week: "W4", p50: 104, p95: 260 },
  { week: "W5", p50: 98, p95: 241 },
  { week: "W6", p50: 95, p95: 232 },
  { week: "W7", p50: 101, p95: 247 },
];

const config = {
  p50: { label: "p50 latency (ms)", color: "var(--chart-1)" },
  p95: { label: "p95 latency (ms)", color: "var(--chart-4)" },
} satisfies ChartConfig;

export default function ChartLineTooltipDemo() {
  const reduced = useChartReducedMotion();

  return (
    <ChartContainer config={config} title="API latency over seven weeks" className="aspect-auto h-56 w-full max-w-lg">
      <LineChart data={data} margin={{ left: 12, right: 12, top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} isAnimationActive={!reduced} />
        {(["p50", "p95"] as const).map((key) => (
          <Line
            key={key}
            dataKey={key}
            type="monotone"
            stroke={`var(--color-${key})`}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: `var(--color-${key})`, stroke: "var(--color-background)", strokeWidth: 2 }}
            isAnimationActive={!reduced}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}
