"use client";

import * as React from "react";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, Rectangle, XAxis, type BarShapeProps } from "recharts";
import { useReducedMotion } from "motion/react";

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

type Datum = Record<string, string | number>;

export interface BarChartCardProps extends Omit<React.ComponentProps<"section">, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  data: Datum[];
  /** Must contain `dataKey`: `{ revenue: { label, color } }`. */
  config: ChartConfig;
  /** Key of the category (x) value. */
  index: string;
  /** Key of the value to plot. */
  dataKey: string;
  /** Formats values. Defaults to en-US grouping (stable across server and client). */
  valueFormatter?: (value: number) => string;
  /** What the headline shows when nothing is hovered. */
  summary?: "total" | "average" | "last";
  /** Accessible name for the chart. Defaults to the title when it is a string. */
  chartLabel?: string;
}

const numberFormat = new Intl.NumberFormat("en-US");
const defaultValueFormatter = (value: number) => numberFormat.format(value);

/**
 * A bar chart card where hovering a bar dims the others, lifts the hovered
 * one with a soft glow and swaps the headline to its value. Bars grow in
 * on mount (off under reduced motion). Keyboard users can focus the chart
 * and arrow through bars; the active bar glows the same way. A visually
 * hidden table carries the numbers for screen readers.
 */
export function BarChartCard({
  title,
  description,
  data,
  config,
  index,
  dataKey,
  valueFormatter = defaultValueFormatter,
  summary = "total",
  chartLabel,
  className,
  ...props
}: BarChartCardProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [hovered, setHovered] = React.useState<number | null>(null);
  const label = typeof title === "string" ? title : chartLabel;
  const seriesLabel = config[dataKey]?.label ?? dataKey;

  const values = data.map((d) => Number(d[dataKey] ?? 0));
  const total = values.reduce((sum, v) => sum + v, 0);
  const headline =
    hovered !== null
      ? values[hovered]
      : summary === "total"
        ? total
        : summary === "average"
          ? Math.round(total / Math.max(1, values.length))
          : values[values.length - 1];
  const caption =
    hovered !== null ? String(data[hovered]?.[index] ?? "") : summary === "total" ? "Total" : summary === "average" ? "Average" : "Latest";

  const renderBar = React.useCallback(
    (shape: BarShapeProps) => {
      const dimmed = hovered !== null && shape.index !== hovered;
      const lit = shape.isActive || shape.index === hovered;
      return (
        <Rectangle
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          radius={[6, 6, 2, 2]}
          fill={`var(--color-${dataKey})`}
          fillOpacity={dimmed ? 0.28 : 1}
          style={{
            transition: reduceMotion ? undefined : "fill-opacity 200ms ease-out, filter 200ms ease-out",
            filter: lit ? `drop-shadow(0 0 10px var(--color-${dataKey}))` : "none",
          }}
        />
      );
    },
    [hovered, dataKey, reduceMotion]
  );

  return (
    <section
      className={cn(
        "w-full rounded-2xl border bg-card/60 p-5 text-card-foreground",
        "shadow-[inset_0_1px_0_rgb(255_255_255/0.04),0_16px_48px_-24px_rgb(0_0_0/0.8)]",
        className
      )}
      {...props}
    >
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-muted-foreground/80">{description}</p>}
        </div>
        <div className="text-right" aria-hidden>
          <div className="text-xs text-muted-foreground">{caption}</div>
          <div className="text-2xl font-semibold tracking-tight tabular-nums">{valueFormatter(headline ?? 0)}</div>
        </div>
      </header>

      <ChartContainer config={config} title={label} className="mt-4 aspect-auto h-56 w-full">
        <RechartsBarChart
          data={data}
          margin={{ left: 4, right: 4, top: 12, bottom: 0 }}
          onMouseMove={(state) => {
            const i = Number(state.activeTooltipIndex);
            setHovered(Number.isFinite(i) && state.isTooltipActive ? i : null);
          }}
          onMouseLeave={() => setHovered(null)}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey={index} tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip
            cursor={false}
            isAnimationActive={!reduceMotion}
            content={<ChartTooltipContent hideIndicator={false} indicator="dot" />}
          />
          <Bar
            dataKey={dataKey}
            name={typeof seriesLabel === "string" ? seriesLabel : dataKey}
            fill={`var(--color-${dataKey})`}
            shape={renderBar}
            activeBar={renderBar}
            isAnimationActive={!reduceMotion}
            animationDuration={800}
            animationEasing="ease-out"
          />
        </RechartsBarChart>
      </ChartContainer>

      <table className="sr-only">
        <caption>{label}</caption>
        <thead>
          <tr>
            <th scope="col">{index}</th>
            <th scope="col">{typeof seriesLabel === "string" ? seriesLabel : dataKey}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <th scope="row">{String(d[index])}</th>
              <td>{valueFormatter(values[i] ?? 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
