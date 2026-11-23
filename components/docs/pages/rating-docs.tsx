import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import RatingDemo from "@/components/demos/rating/rating-demo";
import RatingHalfDemo from "@/components/demos/rating/rating-half";
import RatingCustomDemo from "@/components/demos/rating/rating-custom";
import RatingFormDemo from "@/components/demos/rating/rating-form";

const demo = (file: string) => `components/demos/rating/${file}`;

const config: DocConfig = {
  title: "Rating",
  intro:
    "An accessible React star rating component built with Tailwind CSS and Motion: hover to preview, click or use the arrow keys to rate, half-star steps, and a small pop as the stars fill. Read-only mode fills fractional averages precisely, any lucide icon, count, size or color works, and a hidden input submits the value with your form.",
  tags: ["Hover preview", "Half stars", "Pop on select", "Read-only averages", "Custom icons", "Form-ready", "Slider a11y"],
  hero: { Demo: RatingDemo, file: demo("rating-demo.tsx"), minHeight: 240 },
  install: {
    registry: "rating",
    source: "components/dusk/rating/rating.tsx",
    deps: "motion lucide-react",
  },
  usage: {
    filename: "review.tsx",
    code: `"use client"

import * as React from "react"
import { Rating } from "@/components/dusk/rating/rating"

export function Review() {
  const [stars, setStars] = React.useState(0)
  return <Rating value={stars} onValueChange={setStars} label="Rate this product" />
}`,
  },
  examples: [
    {
      id: "half",
      title: "Half stars & read-only",
      description: (
        <>
          <Code>allowHalf</Code> picks the left or right half of each star. With <Code>readOnly</Code> any fraction — like
          an average of 4.7 — fills to the exact width.
        </>
      ),
      Demo: RatingHalfDemo,
      file: demo("rating-half.tsx"),
      minHeight: 280,
    },
    {
      id: "custom",
      title: "Icons, count, size & color",
      description: (
        <>
          Pass any lucide icon to <Code>icon</Code>, change <Code>count</Code>, set <Code>size</Code> to a preset or pixels,
          and tint it with <Code>color</Code>. <Code>getValueText</Code> customises what screen readers hear.
        </>
      ),
      Demo: RatingCustomDemo,
      file: demo("rating-custom.tsx"),
      minHeight: 260,
    },
    {
      id: "form",
      title: "In a form",
      description: (
        <>
          Give it a <Code>name</Code> and the value is submitted through a hidden input, so it works with FormData and
          server actions.
        </>
      ),
      Demo: RatingFormDemo,
      file: demo("rating-form.tsx"),
      minHeight: 340,
    },
  ],
  api: {
    intro: <>Also accepts any div attribute.</>,
    props: [
      { name: "value", type: "number", description: "Controlled value." },
      { name: "defaultValue", type: "number", default: "0", description: "Starting value when uncontrolled." },
      { name: "onValueChange", type: "(value: number) => void", description: "Called when the user picks a value." },
      { name: "count", type: "number", default: "5", description: "Number of icons." },
      { name: "allowHalf", type: "boolean", default: "false", description: "Allow 0.5 steps." },
      { name: "readOnly", type: "boolean", default: "false", description: "Display only; renders as an image with a spoken value." },
      { name: "disabled", type: "boolean", default: "false", description: "Dims the rating and removes it from the tab order." },
      { name: "clearable", type: "boolean", default: "true", description: "Clicking the current value again resets to 0." },
      { name: "size", type: '"sm" | "md" | "lg" | number', default: '"md"', description: "Icon size preset (18 / 24 / 32px) or pixels." },
      { name: "color", type: "string", default: "var(--color-primary)", description: "Fill color." },
      { name: "icon", type: "ComponentType<LucideProps>", default: "Star", description: "Icon to render." },
      { name: "name", type: "string", description: "Renders a hidden input with this name." },
      { name: "label", type: "string", default: '"Rating"', description: "Accessible name." },
      { name: "getValueText", type: "(value, count) => string", default: '"3 out of 5 stars"', description: "Spoken value text." },
    ],
  },
  accessibility: [
    <>Interactive ratings are a single focusable <Code>role=&quot;slider&quot;</Code> with <Code>aria-valuenow</Code>, <Code>aria-valuemax</Code> and value text like “3.5 out of 5 stars”.</>,
    "Arrow keys change the value by one step (half a star with allowHalf), Home clears it, End fills every star, and number keys jump straight to a value.",
    <>Read-only ratings render as <Code>role=&quot;img&quot;</Code> with a label such as “Aurora Hotel: 4.7 out of 5 stars”, so averages are read once instead of star by star.</>,
    "The icons are decorative and hidden from assistive technology.",
    "Hover preview is mouse-only; touch taps set the value directly.",
    "With prefers-reduced-motion the pop and fill transitions are skipped.",
  ],
};

export function RatingDocs() {
  return <ComponentDocs config={config} />;
}
