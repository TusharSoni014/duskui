"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import type { LegendPayload, TooltipPayloadEntry } from "recharts"

import { cn } from "@/lib/utils"

/**
 * DuskUI Chart — the shadcn/ui Chart helpers on Recharts v3, themed for DuskUI.
 *
 * Same API as shadcn (ChartContainer, ChartTooltip, ChartTooltipContent,
 * ChartLegend, ChartLegendContent, ChartStyle, ChartConfig), plus:
 * - Axis ticks, grid lines, cursors and active dots use the DuskUI tokens, so
 *   charts sit on the dark surface without extra styling.
 * - A frosted tooltip with a hairline border, tabular numbers and an
 *   indicator that matches each series color.
 * - `ChartContainer` is a labelled `figure` when you pass `title`, and keeps
 *   Recharts' keyboard accessibility layer (arrow keys move the tooltip).
 * - `useChartReducedMotion()` returns `true` under `prefers-reduced-motion`,
 *   so you can pass `isAnimationActive={!reduced}` to series and tooltips.
 * Colors come from the config as CSS variables: a series keyed `desktop`
 * reads `var(--color-desktop)`.
 */

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

/** Reads the nearest ChartContainer's config. */
function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }
  return context
}

const reducedMotionQuery = "(prefers-reduced-motion: reduce)"

function subscribeReducedMotion(onChange: () => void) {
  const mql = window.matchMedia(reducedMotionQuery)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

/**
 * `true` when the user prefers reduced motion. `false` on the server and
 * during hydration, so markup always matches; charts only draw on the client.
 */
function useChartReducedMotion() {
  return React.useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => false
  )
}

/** Sizes the chart to its box, injects the config colors and themes Recharts. */
function ChartContainer({
  id,
  className,
  children,
  config,
  title,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  /** Accessible name for the chart. Renders the container as role="figure". */
  title?: string
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"]
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${id ?? uniqueId.replace(/[^a-zA-Z0-9_-]/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        role={title ? "figure" : undefined}
        aria-label={title}
        className={cn(
          "flex aspect-video justify-center text-xs",
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
          "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-white/[0.06]",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-white/20",
          "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-white/10",
          "[&_.recharts-radial-bar-background-sector]:fill-white/[0.05]",
          "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-white/[0.04]",
          "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-white/10",
          "[&_.recharts-dot[stroke='#fff']]:stroke-background",
          "[&_.recharts-sector[stroke='#fff']]:stroke-background",
          "[&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-surface]:outline-hidden",
          "[&_.recharts-wrapper:has(.recharts-surface:focus-visible)]:rounded-md [&_.recharts-wrapper:has(.recharts-surface:focus-visible)]:ring-2 [&_.recharts-wrapper:has(.recharts-surface:focus-visible)]:ring-ring/50",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

/** Writes `--color-<key>` variables for every config entry, scoped to one chart. */
function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(
    ([, itemConfig]) => itemConfig.theme || itemConfig.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart="${id}"] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ??
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .filter(Boolean)
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

/** Recharts' Tooltip. Pass `content={<ChartTooltipContent />}`. */
const ChartTooltip = RechartsPrimitive.Tooltip

type ChartTooltipContentProps = {
  /** Injected by Recharts. */
  active?: boolean
  /** Injected by Recharts. */
  payload?: ReadonlyArray<TooltipPayloadEntry>
  /** Injected by Recharts. */
  label?: React.ReactNode
  className?: string
  /** Hide the heading (the x value / category). */
  hideLabel?: boolean
  /** Hide the colored swatch next to each value. */
  hideIndicator?: boolean
  indicator?: "line" | "dot" | "dashed"
  /** Payload key to look up the series label in the config. */
  nameKey?: string
  /** Data key to look up the heading in the config. */
  labelKey?: string
  labelFormatter?: (
    label: React.ReactNode,
    payload: ReadonlyArray<TooltipPayloadEntry>
  ) => React.ReactNode
  labelClassName?: string
  formatter?: (
    value: TooltipPayloadEntry["value"],
    name: TooltipPayloadEntry["name"],
    item: TooltipPayloadEntry,
    index: number,
    payload: TooltipPayloadEntry["payload"]
  ) => React.ReactNode
  /** Force one indicator color for every row. */
  color?: string
}

/** The DuskUI tooltip surface: frosted, hairline border, tabular numbers. */
function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: ChartTooltipContentProps) {
  const { config } = useChart()

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null
    }

    const [item] = payload
    const key = `${labelKey ?? item?.dataKey ?? item?.name ?? "value"}`
    const itemConfig = getPayloadConfigFromPayload(config, item, key)
    const value =
      !labelKey && typeof label === "string"
        ? (config[label]?.label ?? label)
        : itemConfig?.label

    if (labelFormatter) {
      return (
        <div className={cn("font-medium text-foreground", labelClassName)}>
          {labelFormatter(value ?? label, payload)}
        </div>
      )
    }

    if (!value) {
      return null
    }

    return <div className={cn("font-medium text-foreground", labelClassName)}>{value}</div>
  }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey])

  if (!active || !payload?.length) {
    return null
  }

  const nestLabel = payload.length === 1 && indicator !== "dot"

  return (
    <div
      data-slot="chart-tooltip"
      className={cn(
        "grid min-w-32 items-start gap-1.5 rounded-lg border border-white/10 bg-popover/85 px-2.5 py-1.5 text-xs backdrop-blur-md",
        "shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_12px_32px_-8px_rgb(0_0_0/0.7)]",
        className
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload
          .filter((item) => item.type !== "none")
          .map((item, index) => {
            const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor =
              color ?? (item.payload as { fill?: string } | undefined)?.fill ?? item.color

            return (
              <div
                key={`${item.dataKey ?? index}`}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:size-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item.value !== undefined && item.name !== undefined ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          aria-hidden
                          className={cn(
                            "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                            {
                              "size-2.5 rounded-full shadow-[0_0_8px_var(--color-bg)]": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between gap-4 leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label ?? item.name}
                        </span>
                      </div>
                      {item.value !== undefined && item.value !== null && (
                        <span className="font-mono font-medium text-foreground tabular-nums">
                          {typeof item.value === "number"
                            ? item.value.toLocaleString()
                            : String(item.value)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

/** Recharts' Legend. Pass `content={<ChartLegendContent />}`. */
const ChartLegend = RechartsPrimitive.Legend

/** A row of swatches and labels taken from the chart config. */
function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: {
  className?: string
  /** Hide the swatch (or the config icon). */
  hideIcon?: boolean
  /** Injected by Recharts. */
  payload?: ReadonlyArray<LegendPayload>
  /** Injected by Recharts. */
  verticalAlign?: "top" | "bottom" | "middle"
  /** Payload key to look up the series label in the config. */
  nameKey?: string
}) {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  return (
    <ul
      data-slot="chart-legend"
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload
        .filter((item) => item.type !== "none")
        .map((item) => {
          const key = `${nameKey ?? item.dataKey ?? "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <li
              key={`${item.value ?? key}`}
              className={cn(
                "flex items-center gap-1.5 text-muted-foreground [&>svg]:size-3 [&>svg]:text-muted-foreground",
                item.inactive && "opacity-50"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                !hideIcon && (
                  <span
                    aria-hidden
                    className="size-2 shrink-0 rounded-[2px]"
                    style={{ backgroundColor: item.color }}
                  />
                )
              )}
              {itemConfig?.label ?? item.value}
            </li>
          )
        })}
    </ul>
  )
}

/** Finds the config entry for a tooltip / legend item. */
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config ? config[configLabelKey] : config[key]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  useChart,
  useChartReducedMotion,
}
