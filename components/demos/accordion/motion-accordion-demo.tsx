import {
  MotionAccordion,
  MotionAccordionContent,
  MotionAccordionItem,
  MotionAccordionTrigger,
} from "@/components/dusk/accordion/motion-accordion";

const items = [
  {
    value: "install",
    title: "How do I install a component?",
    body: "Run the shadcn CLI with the component's registry URL. It copies the source into your project and installs its dependencies.",
  },
  {
    value: "motion",
    title: "Which animation library is used?",
    body: "Motion (formerly Framer Motion). Heights use springs, and content fades in once the panel starts opening.",
  },
  {
    value: "reduced",
    title: "What about reduced motion?",
    body: "With prefers-reduced-motion the panels open instantly and nothing slides. Colors still fade, so state changes stay clear.",
  },
  {
    value: "seo",
    title: "Are closed answers indexed?",
    body: "Yes. Closed panels stay in the DOM (marked inert), so search engines can read every answer.",
  },
];

export default function MotionAccordionDemo() {
  return (
    <MotionAccordion defaultValue={["install"]} className="max-w-lg">
      {items.map((item) => (
        <MotionAccordionItem key={item.value} value={item.value}>
          <MotionAccordionTrigger>{item.title}</MotionAccordionTrigger>
          <MotionAccordionContent>{item.body}</MotionAccordionContent>
        </MotionAccordionItem>
      ))}
    </MotionAccordion>
  );
}
