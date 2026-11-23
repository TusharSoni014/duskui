import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import NumberTickerDemo from "@/components/demos/number-ticker/number-ticker-demo";
import NumberTickerFormatsDemo from "@/components/demos/number-ticker/number-ticker-formats";
import NumberTickerLiveDemo from "@/components/demos/number-ticker/number-ticker-live";

const demo = (file: string) => `components/demos/number-ticker/${file}`;

const config: DocConfig = {
  title: "Number Ticker",
  intro:
    "An animated number counter for React and Tailwind CSS that springs up or down to its value when it scrolls into view. Formatting uses Intl.NumberFormat (locales, currency, percent, decimals), digits are tabular so nothing jitters, and the final value is rendered on the server for SEO.",
  tags: ["Server-rendered final value", "Intl.NumberFormat", "Spring physics", "Counts up & down", "No re-renders", "prefers-reduced-motion"],
  hero: { Demo: NumberTickerDemo, file: demo("number-ticker-demo.tsx"), minHeight: 260 },
  install: {
    registry: "number-ticker",
    source: "components/dusk/text/number-ticker.tsx",
    deps: "motion",
  },
  usage: {
    filename: "stats.tsx",
    code: `import { NumberTicker } from "@/components/dusk/text/number-ticker"

export function Stats() {
  return (
    <p className="text-4xl font-bold">
      <NumberTicker value={48200} currency="USD" decimals={0} />
    </p>
  )
}`,
  },
  examples: [
    {
      id: "formats",
      title: "Locales & formats",
      description: (
        <>
          Pass a <Code>locale</Code>, a <Code>currency</Code>, fixed <Code>decimals</Code> or any{" "}
          <Code>Intl.NumberFormat</Code> options through <Code>format</Code>. Set <Code>from</Code> above{" "}
          <Code>value</Code> to count down.
        </>
      ),
      Demo: NumberTickerFormatsDemo,
      file: demo("number-ticker-formats.tsx"),
      minHeight: 340,
    },
    {
      id: "live",
      title: "Live values",
      description: (
        <>
          When <Code>value</Code> changes, the number springs from where it is to the new value, up or down. A
          little <Code>bounce</Code> makes updates feel physical.
        </>
      ),
      Demo: NumberTickerLiveDemo,
      file: demo("number-ticker-live.tsx"),
      minHeight: 240,
    },
  ],
  api: {
    intro: <>Also accepts any HTML attribute for the rendered element.</>,
    props: [
      { name: "value", type: "number", description: "The number to count to. Changing it springs from the current value." },
      { name: "from", type: "number", default: "0", description: "Where the count starts the first time it comes into view." },
      { name: "locale", type: "string", default: '"en-US"', description: "Locale for Intl.NumberFormat. Fixed by default so server and browser output match." },
      { name: "currency", type: "string", description: 'ISO 4217 code such as "USD". Formats as currency.' },
      { name: "decimals", type: "number", description: "Fixed decimal places. Defaults to the decimals in value (or the currency's default)." },
      { name: "format", type: "Intl.NumberFormatOptions", description: "Any other formatter options (notation, style, signDisplay…). They win over the props above." },
      { name: "prefix", type: "string", description: "Text before the number." },
      { name: "suffix", type: "string", description: 'Text after the number, e.g. "+" or "%".' },
      { name: "duration", type: "number", default: "1.6", description: "Spring duration in seconds." },
      { name: "bounce", type: "number", default: "0", description: "Spring bounciness (0–1). 0 never overshoots the target." },
      { name: "delay", type: "number", default: "0", description: "Seconds to wait after entering the view." },
      { name: "once", type: "boolean", default: "true", description: "Count only the first time. When false it recounts on every entry." },
      { name: "animate", type: "boolean", default: "true", description: "Set to false to always show the final value." },
      { name: "as", type: '"span" | "p" | "div" | "strong" | "data" | "h1" … "h6"', default: '"span"', description: 'Element to render. "data" also sets its machine-readable value attribute.' },
    ],
  },
  accessibility: [
    "The final, formatted value is rendered on the server, so crawlers and no-JS visitors see the real number, not 0.",
    "Screen readers read the final value from a visually hidden copy; the animating digits are aria-hidden, so nothing is announced mid-count.",
    "tabular-nums and a reserved width (the wider of the start and end values) prevent layout shift while counting.",
    "The count runs outside React (Motion value written to the DOM), so it never re-renders your page.",
    "With prefers-reduced-motion the final value is shown immediately.",
  ],
};

export function NumberTickerDocs() {
  return <ComponentDocs config={config} />;
}
