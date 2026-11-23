"use client";

import * as React from "react";
import { Area, AreaChart as RechartsAreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

type Datum = Record<string, string | number>;

export interface ChartRange {
  /** Button text, e.g. "7d". */
  label: string;
  /** How many trailing data points the range shows. */
  points: number;
}

export interface AreaChartCardProps extends Omit<React.ComponentProps<"section">, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Rows of data, oldest first. Keep it static or memoized. */
  data: Datum[];
  /** One entry per series: `{ desktop: { label, color } }`. Order sets the stack order. */
  config: ChartConfig;
  /** Key of the x value (a date or category). */
  index: string;
  /** Range buttons that show the last N points. Omit to show everything. */
  ranges?: ChartRange[];
  defaultRange?: string;
  /** Stack the series instead of overlapping them. */
  stacked?: boolean;
  /** Formats x values for ticks, the tooltip and the readout. */
  labelFormatter?: (value: string | number) => string;
  /** Formats y values. Defaults to en-US grouping (stable across server and client). */
  valueFormatter?: (value: number) => string;
  /** Accessible name for the chart. Defaults to the title when it is a string. */
  chartLabel?: string;
}

const numberFormat = new Intl.NumberFormat("en-US");

/** The config color for a series (the CSS variables only exist inside the chart). */
function seriesColor(config: ChartConfig, key: string) {
  const entry = config[key];
  return entry?.color ?? entry?.theme?.dark ?? "currentColor";
}
const defaultValueFormatter = (value: number) => numberFormat.format(value);

/**
 * An area chart card with gradient fills that draw in from the left, a
 * readout that follows the pointer (or the keyboard: focus the chart and use
 * the arrow keys), and range buttons with a gliding pill. Series colors come
 * from the chart config. A visually hidden table carries the same numbers
 * for screen readers. Recharts animation is off under reduced motion.
 */
export function AreaChartCard({
  title,
  description,
  data,
  config,
  index,
  ranges,
  defaultRange,
  stacked = false,
  labelFormatter = String,
  valueFormatter = defaultValueFormatter,
  chartLabel,
  className,
  ...props
}: AreaChartCardProps) {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const reduceMotion = useReducedMotion() ?? false;
  const [range, setRange] = React.useState(defaultRange ?? ranges?.[ranges.length - 1]?.label);
  const [active, setActive] = React.useState<number | null>(null);

  const keys = Object.keys(config);
  const points = ranges?.find((r) => r.label === range)?.points ?? data.length;
  const visible = React.useMemo(() => data.slice(-points), [data, points]);
  const row = visible[active ?? visible.length - 1];
  const label = typeof title === "string" ? title : chartLabel;

  return (
    <section
      className={cn(
        "w-full rounded-2xl border bg-card/60 p-5 text-card-foreground",
        "shadow-[inset_0_1px_0_rgb(255_255_255/0.04),0_16px_48px_-24px_rgb(0_0_0/0.8)]",
        className
      )}
      {...props}
    >
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-muted-foreground/80">{description}</p>}
        </div>
        {ranges && ranges.length > 1 && (
          <LayoutGroup id={uid}>
            <div role="group" aria-label="Date range" className="flex rounded-lg border bg-background/60 p-0.5">
              {ranges.map((r) => {
                const selected = r.label === range;
                return (
                  <button
                    key={r.label}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      setRange(r.label);
                      setActive(null);
                    }}
                    className={cn(
                      "relative rounded-md px-2.5 py-1 text-xs font-medium outline-none transition-colors",
                      "focus-visible:ring-[3px] focus-visible:ring-ring/50",
                      selected ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {selected && (
                      <motion.span
                        layoutId="range-pill"
                        className="absolute inset-0 rounded-md bg-white/[0.08] shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]"
                        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 36 }}
                      />
                    )}
                    <span className="relative">{r.label}</span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        )}
      </header>

      {/* Readout: fixed height so hovering never shifts the layout. */}
      <div className="mt-3 flex min-h-12 flex-wrap items-end gap-x-6 gap-y-1" aria-hidden>
        {keys.map((key) => (
          <div key={key} className="flex flex-col">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-2 rounded-[2px]" style={{ backgroundColor: seriesColor(config, key) }} />
              {config[key]?.label ?? key}
            </span>
            <span className="text-2xl font-semibold tracking-tight tabular-nums">
              {row ? valueFormatter(Number(row[key] ?? 0)) : "—"}
            </span>
          </div>
        ))}
        <span className="ml-auto pb-1 text-xs text-muted-foreground tabular-nums">
          {row ? labelFormatter(row[index]) : ""}
        </span>
      </div>

      <ChartContainer
        config={config}
        title={label}
        className="mt-4 aspect-auto h-60 w-full"
      >
        <RechartsAreaChart
          data={visible}
          margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
          onMouseMove={(state) => {
            const i = Number(state.activeTooltipIndex);
            setActive(Number.isFinite(i) && state.isTooltipActive ? i : null);
          }}
          onMouseLeave={() => setActive(null)}
        >
          <defs>
            {keys.map((key) => (
              <linearGradient key={key} id={`${uid}-fill-${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={`var(--color-${key})`} stopOpacity={0.45} />
                <stop offset="70%" stopColor={`var(--color-${key})`} stopOpacity={0.06} />
                <stop offset="100%" stopColor={`var(--color-${key})`} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={index}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={28}
            tickFormatter={(value) => labelFormatter(value)}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={4}
            width={40}
            tickFormatter={(value) => valueFormatter(Number(value))}
          />
          <ChartTooltip
            cursor={{ strokeDasharray: "3 3" }}
            isAnimationActive={!reduceMotion}
            content={
              <ChartTooltipContent
                indicator="dot"
                labelFormatter={(_, payload) => {
                  const x = payload[0]?.payload?.[index];
                  return x === undefined ? null : labelFormatter(x);
                }}
              />
            }
          />
          {[...keys].reverse().map((key) => (
            <Area
              key={key}
              dataKey={key}
              type="monotone"
              stroke={`var(--color-${key})`}
              strokeWidth={2}
              fill={`url(#${uid}-fill-${key})`}
              stackId={stacked ? "stack" : undefined}
              activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--color-background)", fill: `var(--color-${key})` }}
              isAnimationActive={!reduceMotion}
              animationDuration={1100}
              animationEasing="ease-out"
            />
          ))}
          {keys.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
        </RechartsAreaChart>
      </ChartContainer>

      <table className="sr-only">
        <caption>{label}</caption>
        <thead>
          <tr>
            <th scope="col">{index}</th>
            {keys.map((key) => (
              <th key={key} scope="col">
                {typeof config[key]?.label === "string" ? config[key]?.label : key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visible.map((d, i) => (
            <tr key={i}>
              <th scope="row">{labelFormatter(d[index])}</th>
              {keys.map((key) => (
                <td key={key}>{valueFormatter(Number(d[key] ?? 0))}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
