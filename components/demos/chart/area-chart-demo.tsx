"use client";

import { AreaChartCard } from "@/components/dusk/chart/area-chart";
import type { ChartConfig } from "@/components/ui/chart";

const DAY = 86_400_000;
const start = Date.UTC(2026, 7, 26);

// Deterministic demo data (no Math.random), so server and client agree.
const data = Array.from({ length: 90 }, (_, i) => ({
  date: new Date(start + i * DAY).toISOString().slice(0, 10),
  desktop: Math.round(240 + 70 * Math.sin(i / 6) + 35 * Math.sin(i / 2.2) + i * 1.8),
  mobile: Math.round(150 + 50 * Math.cos(i / 5) + 25 * Math.sin(i / 1.6) + i * 1.2),
}));

const config = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-3)" },
} satisfies ChartConfig;

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

export default function AreaChartDemo() {
  return (
    <AreaChartCard
      className="max-w-2xl"
      title="Visitors"
      description="Unique visitors per day"
      data={data}
      config={config}
      index="date"
      ranges={[
        { label: "7d", points: 7 },
        { label: "30d", points: 30 },
        { label: "90d", points: 90 },
      ]}
      defaultRange="30d"
      labelFormatter={(value) => dateFormat.format(new Date(`${value}T00:00:00Z`))}
    />
  );
}
