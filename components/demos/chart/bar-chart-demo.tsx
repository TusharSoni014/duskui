"use client";

import { BarChartCard } from "@/components/dusk/chart/bar-chart";
import type { ChartConfig } from "@/components/ui/chart";

const data = [
  { month: "Jan", revenue: 18_400 },
  { month: "Feb", revenue: 21_900 },
  { month: "Mar", revenue: 19_300 },
  { month: "Apr", revenue: 26_700 },
  { month: "May", revenue: 24_100 },
  { month: "Jun", revenue: 31_200 },
  { month: "Jul", revenue: 29_800 },
  { month: "Aug", revenue: 34_600 },
];

const config = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig;

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function BarChartDemo() {
  return (
    <BarChartCard
      className="max-w-xl"
      title="Monthly revenue"
      description="January – August 2026"
      data={data}
      config={config}
      index="month"
      dataKey="revenue"
      valueFormatter={(value) => currency.format(value)}
    />
  );
}
