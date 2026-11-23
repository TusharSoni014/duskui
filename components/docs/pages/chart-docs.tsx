import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import ChartBasicDemo from "@/components/demos/chart/chart-basic";
import ChartLineTooltipDemo from "@/components/demos/chart/chart-line-tooltip";
import AreaChartDemo from "@/components/demos/chart/area-chart-demo";
import BarChartDemo from "@/components/demos/chart/bar-chart-demo";
import RadialStatDemo from "@/components/demos/chart/radial-stat-demo";

const demo = (file: string) => `components/demos/chart/${file}`;
const block = (file: string) => `components/dusk/chart/${file}`;

const config: DocConfig = {
  title: "Chart",
  intro:
    "Animated React charts built on shadcn/ui and Recharts v3: themed ChartContainer, tooltip and legend helpers for dark dashboards, plus an area chart with gradient fills that draw in, a bar chart with hover highlights and a radial progress stat that counts up.",
  tags: ["Drop-in shadcn API", "Recharts v3", "Themed tooltips", "Accessible data tables", "prefers-reduced-motion"],
  hero: { Demo: AreaChartDemo, file: demo("area-chart-demo.tsx"), minHeight: 460 },
  install: {
    registry: "chart",
    source: "components/ui/chart.tsx",
    deps: "recharts",
    note: (
      <>
        Adds <Code>components/ui/chart.tsx</Code> with the shadcn exports, typed for Recharts v3. Each config
        entry becomes a CSS variable scoped to its chart (<Code>desktop</Code> →{" "}
        <Code>var(--color-desktop)</Code>). <Code>useChartReducedMotion()</Code> is exported so you can pass{" "}
        <Code>isAnimationActive</Code> explicitly.
      </>
    ),
  },
  usage: {
    filename: "visitors-chart.tsx",
    code: `"use client"

import { Bar, BarChart, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  useChartReducedMotion,
  type ChartConfig,
} from "@/components/ui/chart"

const data = [
  { month: "Jan", desktop: 186 },
  { month: "Feb", desktop: 305 },
]

const config = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
} satisfies ChartConfig

export function VisitorsChart() {
  const reduced = useChartReducedMotion()
  return (
    <ChartContainer config={config} title="Desktop visitors" className="h-56 w-full">
      <BarChart data={data}>
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} isAnimationActive={!reduced} />
      </BarChart>
    </ChartContainer>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description: (
        <>
          A grouped bar chart with <Code>ChartTooltipContent</Code> and <Code>ChartLegendContent</Code>. Labels
          and colors come from the config, and axis ticks and grid lines pick up the DuskUI tokens.
        </>
      ),
      Demo: ChartBasicDemo,
      file: demo("chart-basic.tsx"),
      minHeight: 320,
    },
    {
      id: "line-tooltip",
      title: "Line indicator tooltip",
      description: (
        <>
          <Code>indicator</Code> switches the tooltip swatch between <Code>dot</Code>, <Code>line</Code> and{" "}
          <Code>dashed</Code>. Focus the chart and use the arrow keys to move the tooltip — Recharts&apos;
          accessibility layer is on by default in v3.
        </>
      ),
      Demo: ChartLineTooltipDemo,
      file: demo("chart-line-tooltip.tsx"),
      minHeight: 300,
    },
  ],
  blocks: [
    {
      id: "area-chart",
      title: "Area Chart",
      registry: "area-chart",
      source: block("area-chart.tsx"),
      deps: "motion recharts",
      description: (
        <>
          A dashboard card with gradient-filled areas that draw in from the left, a readout that follows the
          pointer or keyboard, and range buttons with a gliding pill. The readout has a fixed height, so
          hovering never shifts the layout. A visually hidden table carries the numbers for screen readers.
        </>
      ),
      Demo: AreaChartDemo,
      file: demo("area-chart-demo.tsx"),
      minHeight: 460,
      props: [
        { name: "title / description", type: "ReactNode", description: "Card heading. A string title also names the chart." },
        { name: "data", type: "Record<string, string | number>[]", description: "Rows, oldest first. Keep it static or memoized." },
        { name: "config", type: "ChartConfig", description: "One entry per series; keys are data keys." },
        { name: "index", type: "string", description: "Key of the x value." },
        { name: "ranges / defaultRange", type: "{ label, points }[] / string", description: "Range buttons that show the last N points." },
        { name: "stacked", type: "boolean", default: "false", description: "Stack the series instead of overlapping." },
        { name: "labelFormatter / valueFormatter", type: "(value) => string", description: "Format x and y values. Use fixed locales to keep SSR stable." },
        { name: "chartLabel", type: "string", description: "Accessible name when the title isn't a string." },
      ],
    },
    {
      id: "bar-chart",
      title: "Bar Chart",
      registry: "bar-chart",
      source: block("bar-chart.tsx"),
      deps: "motion recharts",
      description: (
        <>
          Hovering a bar dims the others, lifts the hovered one with a glow and swaps the headline to its
          value. Bars grow in on mount, and the keyboard-active bar glows the same way.
        </>
      ),
      Demo: BarChartDemo,
      file: demo("bar-chart-demo.tsx"),
      minHeight: 380,
      props: [
        { name: "title / description", type: "ReactNode", description: "Card heading. A string title also names the chart." },
        { name: "data / config", type: "Record<string, string | number>[] / ChartConfig", description: "Rows and the config entry for `dataKey`." },
        { name: "index / dataKey", type: "string", description: "Category key and value key." },
        { name: "summary", type: '"total" | "average" | "last"', default: '"total"', description: "Headline when nothing is hovered." },
        { name: "valueFormatter", type: "(value: number) => string", description: "Formats the headline, tooltip and table." },
        { name: "chartLabel", type: "string", description: "Accessible name when the title isn't a string." },
      ],
    },
    {
      id: "radial-stat",
      title: "Radial Stat",
      registry: "radial-stat",
      source: block("radial-stat.tsx"),
      deps: "motion recharts",
      description: (
        <>
          A rounded ring sweeps to the value while the number in the middle counts up with it (a Motion
          value, so the count never re-renders React). The figure is labelled with the exact value and
          percentage; the moving counter is hidden from screen readers.
        </>
      ),
      Demo: RadialStatDemo,
      file: demo("radial-stat-demo.tsx"),
      minHeight: 300,
      props: [
        { name: "value / max", type: "number", default: "— / 100", description: "Current value and the value that fills the ring." },
        { name: "label", type: "string", description: "What is measured; used in the accessible name." },
        { name: "unit", type: "string", description: "Shown after the number." },
        { name: "color", type: "string", default: '"var(--color-primary)"', description: "Ring color, any CSS color." },
        { name: "thickness", type: "number", default: "0.14", description: "Ring thickness as a fraction of the radius." },
        { name: "caption / valueFormatter", type: "ReactNode / (value: number) => string", description: "Line under the ring and number formatting." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        Same parts as shadcn/ui: <Code>ChartContainer</Code>, <Code>ChartTooltip</Code>,{" "}
        <Code>ChartTooltipContent</Code>, <Code>ChartLegend</Code>, <Code>ChartLegendContent</Code>,{" "}
        <Code>ChartStyle</Code> and the <Code>ChartConfig</Code> type, plus <Code>useChart</Code> and{" "}
        <Code>useChartReducedMotion</Code>.
      </>
    ),
    props: [
      { name: "config", type: "ChartConfig", description: "On ChartContainer: { [key]: { label?, icon?, color? | theme? } }." },
      { name: "title", type: "string", description: "On ChartContainer: accessible name; renders the container as role=\"figure\"." },
      { name: "indicator", type: '"dot" | "line" | "dashed"', default: '"dot"', description: "On ChartTooltipContent: swatch style." },
      { name: "hideLabel / hideIndicator", type: "boolean", default: "false", description: "On ChartTooltipContent." },
      { name: "labelKey / nameKey", type: "string", description: "On ChartTooltipContent / ChartLegendContent: config lookup keys." },
      { name: "labelFormatter / formatter", type: "function", description: "On ChartTooltipContent: custom heading and rows." },
      { name: "hideIcon", type: "boolean", default: "false", description: "On ChartLegendContent." },
    ],
  },
  accessibility: [
    "ChartContainer takes a title that becomes the chart's accessible name (role=\"figure\").",
    "Recharts v3's accessibility layer is on: focus a chart and use the arrow keys to move the tooltip between points.",
    "The blocks render a visually hidden data table, so screen readers get every value without hovering.",
    "Under prefers-reduced-motion the blocks pass isAnimationActive={false}: series appear at their final shape and counters jump to the value.",
  ],
};

export function ChartDocs() {
  return <ComponentDocs config={config} />;
}
