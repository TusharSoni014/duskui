"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  useChartReducedMotion,
  type ChartConfig,
} from "@/components/ui/chart";

const data = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 173, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
];

const config = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-3)" },
} satisfies ChartConfig;

export default function ChartBasicDemo() {
  const reduced = useChartReducedMotion();

  return (
    <ChartContainer config={config} title="Visitors by device, January to June" className="min-h-[220px] w-full max-w-lg">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} isAnimationActive={!reduced} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} isAnimationActive={!reduced} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} isAnimationActive={!reduced} />
      </BarChart>
    </ChartContainer>
  );
}
