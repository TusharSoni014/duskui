import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import AccordionBasicDemo from "@/components/demos/accordion/accordion-basic";
import AccordionMultipleDemo from "@/components/demos/accordion/accordion-multiple";
import MotionAccordionDemo from "@/components/demos/accordion/motion-accordion-demo";
import FaqAccordionDemo from "@/components/demos/accordion/faq-accordion-demo";

const demo = (file: string) => `components/demos/accordion/${file}`;
const block = (file: string) => `components/dusk/accordion/${file}`;

const config: DocConfig = {
  title: "Accordion",
  intro:
    "An animated React accordion built on shadcn/ui and Radix: the drop-in Accordion eases its height open, fades answers in and turns its chevron with a little overshoot — plus a spring-physics Motion accordion with a gliding hover highlight, and an SEO-ready FAQ section with a plus-to-minus icon and FAQPage JSON-LD.",
  tags: ["Drop-in shadcn API", "Radix Accordion", "Spring height", "FAQ schema", "prefers-reduced-motion"],
  hero: { Demo: MotionAccordionDemo, file: demo("motion-accordion-demo.tsx"), minHeight: 380 },
  install: {
    registry: "accordion",
    source: "components/ui/accordion.tsx",
    deps: "@radix-ui/react-accordion lucide-react",
    note: (
      <>
        Replaces <Code>components/ui/accordion.tsx</Code> with the same parts and{" "}
        <Code>data-slot</Code> attributes. The height animation uses the{" "}
        <Code>accordion-down</Code> / <Code>accordion-up</Code> keyframes from tw-animate-css, which
        shadcn projects already include.
      </>
    ),
  },
  usage: {
    filename: "faq.tsx",
    code: `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function Faq() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="refunds">
        <AccordionTrigger>Can I get a refund?</AccordionTrigger>
        <AccordionContent>Yes, within 30 days, no questions asked.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description: (
        <>
          <Code>type=&quot;single&quot;</Code> with <Code>collapsible</Code> keeps at most one item open.
          The answer fades and un-blurs in while the panel grows; closing is quicker than opening.
        </>
      ),
      Demo: AccordionBasicDemo,
      file: demo("accordion-basic.tsx"),
      minHeight: 280,
    },
    {
      id: "multiple",
      title: "Multiple open",
      description: (
        <>
          <Code>type=&quot;multiple&quot;</Code> lets several sections stay open — handy for settings and
          filters. Triggers accept any content, like a leading icon.
        </>
      ),
      Demo: AccordionMultipleDemo,
      file: demo("accordion-multiple.tsx"),
      minHeight: 300,
    },
  ],
  blocks: [
    {
      id: "motion-accordion",
      title: "Motion Accordion",
      registry: "motion-accordion",
      source: block("motion-accordion.tsx"),
      deps: "motion @radix-ui/react-accordion",
      description: (
        <>
          Panels open on a spring and their content fades, rises and un-blurs in. A soft highlight glides
          between items under the cursor (a shared <Code>layoutId</Code>) and the open item gets a mint
          outline. Closed answers stay in the DOM as <Code>inert</Code>, so they are still indexed by
          search engines. <Code>value</Code> is always an array, in single and multiple mode.
        </>
      ),
      Demo: MotionAccordionDemo,
      file: demo("motion-accordion-demo.tsx"),
      minHeight: 380,
      props: [
        { name: "type", type: '"single" | "multiple"', default: '"single"', description: "One open item at a time, or any number." },
        { name: "collapsible", type: "boolean", default: "true", description: "Single mode: allow closing the open item." },
        { name: "value / onValueChange", type: "string[] / (value: string[]) => void", description: "Controlled open items." },
        { name: "defaultValue", type: "string[]", default: "[]", description: "Items open on first render." },
        { name: "disabled", type: "boolean", default: "false", description: "Disable every item." },
        { name: "MotionAccordionItem / Trigger / Content", type: "AccordionItem / AccordionTrigger / Radix Content props", description: "The parts; Content's className styles its inner wrapper." },
      ],
    },
    {
      id: "faq-accordion",
      title: "FAQ Accordion",
      registry: "faq-accordion",
      source: block("faq-accordion.tsx"),
      deps: "",
      description: (
        <>
          A data-driven FAQ section: numbered questions, a plus that folds into a minus as its badge spins
          and fills, and answers that ease open. Set <Code>jsonLd</Code> to emit schema.org{" "}
          <Code>FAQPage</Code> structured data for rich results. It has no hooks, so it renders in a Server
          Component and the JSON-LD lands in the initial HTML.
        </>
      ),
      Demo: FaqAccordionDemo,
      file: demo("faq-accordion-demo.tsx"),
      minHeight: 380,
      props: [
        { name: "items", type: "{ question, answer, answerText?, value? }[]", description: "Questions and answers. `answer` can be JSX." },
        { name: "multiple", type: "boolean", default: "false", description: "Allow several answers open at once." },
        { name: "defaultValue", type: "string[]", description: "Open on first render: item values or `item-<index>`." },
        { name: "numbered", type: "boolean", default: "true", description: "Prefix questions with 01, 02…" },
        { name: "jsonLd", type: "boolean", default: "false", description: "Render FAQPage JSON-LD. Uses string answers or `answerText`." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        Same parts as shadcn/ui: <Code>Accordion</Code>, <Code>AccordionItem</Code>,{" "}
        <Code>AccordionTrigger</Code> and <Code>AccordionContent</Code>, each forwarding its Radix
        Accordion props. <Code>className</Code> on <Code>AccordionContent</Code> styles the inner padding
        wrapper, like shadcn.
      </>
    ),
    props: [
      { name: "type", type: '"single" | "multiple"', description: "On Accordion. Required by Radix." },
      { name: "collapsible", type: "boolean", default: "false", description: "Single mode: allow closing the open item." },
      { name: "value / defaultValue / onValueChange", type: "string | string[]", description: "Open item(s); an array in multiple mode." },
      { name: "icon", type: "ReactNode", description: "On AccordionTrigger: replaces the chevron. Style it with group-data-[state=open]/accordion-trigger:." },
      { name: "disabled", type: "boolean", default: "false", description: "On Accordion or a single AccordionItem." },
    ],
  },
  accessibility: [
    "Built on Radix Accordion: each trigger is a button inside a heading with aria-expanded and aria-controls; arrow keys, Home and End move between triggers.",
    "Triggers show a focus-visible ring; chevrons and plus / minus icons are aria-hidden.",
    "Motion Accordion keeps closed panels mounted but inert, so their links can't be focused and screen readers skip them.",
    "Under prefers-reduced-motion panels open and close instantly and the chevron snaps; color changes still fade.",
  ],
};

export function AccordionDocs() {
  return <ComponentDocs config={config} />;
}
