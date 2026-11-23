"use client";

import * as React from "react";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

export interface RadialStatProps extends Omit<React.ComponentProps<"figure">, "children"> {
  /** Current value. */
  value: number;
  /** Value that fills the ring. */
  max?: number;
  /** What is measured, e.g. "Storage". Used in the accessible name. */
  label: string;
  /** Unit after the number, e.g. "GB". */
  unit?: string;
  /** Ring color. Any CSS color; defaults to the primary mint. */
  color?: string;
  /** Formats the center number. Defaults to en-US grouping. */
  valueFormatter?: (value: number) => string;
  /** Small line under the ring. Defaults to "value of max unit". */
  caption?: React.ReactNode;
  /** Ring thickness as a fraction of the radius (0–1). */
  thickness?: number;
}

const numberFormat = new Intl.NumberFormat("en-US");
const defaultValueFormatter = (value: number) => numberFormat.format(value);

/**
 * A radial progress stat: a rounded ring sweeps to the value while the
 * number in the middle counts up to match. The figure is labelled with the
 * exact value ("Storage: 72 of 100 GB, 72%"), and the counter is hidden from
 * screen readers so it isn't read mid-count. Under reduced motion the ring
 * and number appear at their final values.
 */
export function RadialStat({
  value,
  max = 100,
  label,
  unit,
  color = "var(--color-primary)",
  valueFormatter = defaultValueFormatter,
  caption,
  thickness = 0.14,
  className,
  ...props
}: RadialStatProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const clamped = Math.min(Math.max(value, 0), max);
  const percent = max > 0 ? Math.round((clamped / max) * 100) : 0;
  const count = useMotionValue(0);
  const text = useTransform(count, (v) => valueFormatter(Math.round(v)));

  React.useEffect(() => {
    if (reduceMotion) {
      count.set(clamped);
      return;
    }
    const controls = animate(count, clamped, { duration: 1.1, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [clamped, count, reduceMotion]);

  const config = { value: { label, color } } satisfies ChartConfig;
  const data = [{ name: label, value: clamped, fill: "var(--color-value)" }];
  const unitText = unit ? ` ${unit}` : "";
  const name = `${label}: ${valueFormatter(clamped)} of ${valueFormatter(max)}${unitText}, ${percent}%`;

  return (
    <figure className={cn("flex w-full max-w-56 flex-col items-center gap-2", className)} aria-label={name} {...props}>
      <div className="relative aspect-square w-full">
        <ChartContainer config={config} className="aspect-square h-full w-full" aria-hidden>
          <RadialBarChart
            data={data}
            startAngle={90}
            endAngle={-270}
            innerRadius={`${Math.round((1 - thickness) * 100)}%`}
            outerRadius="100%"
            accessibilityLayer={false}
          >
            <PolarAngleAxis type="number" domain={[0, max]} tick={false} axisLine={false} />
            <RadialBar
              dataKey="value"
              background
              cornerRadius={999}
              isAnimationActive={!reduceMotion}
              animationDuration={1100}
              animationEasing="ease-out"
              style={{ filter: `drop-shadow(0 0 6px color-mix(in oklab, ${color} 45%, transparent))` }}
            />
          </RadialBarChart>
        </ChartContainer>
        <div aria-hidden className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="flex items-baseline gap-1">
            <motion.span className="text-3xl font-semibold tracking-tight tabular-nums">{text}</motion.span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      </div>
      <figcaption className="text-xs text-muted-foreground tabular-nums">
        {caption ?? `${valueFormatter(clamped)} of ${valueFormatter(max)}${unitText} · ${percent}%`}
      </figcaption>
    </figure>
  );
}
