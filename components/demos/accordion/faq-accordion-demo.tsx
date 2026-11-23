import { FaqAccordion } from "@/components/dusk/accordion/faq-accordion";

const faqs = [
  {
    question: "Is DuskUI free to use?",
    answer: "Yes. Every component is open source and free for personal and commercial projects.",
  },
  {
    question: "Do I need shadcn/ui?",
    answer:
      "No, but it helps. Components install with the shadcn CLI and follow its conventions, so they fit right into a shadcn project.",
  },
  {
    question: "Does it support dark mode?",
    answer: "DuskUI is designed dark-first. Colors come from CSS variables, so you can retheme everything in one place.",
  },
  {
    question: "Can I use it with the Next.js App Router?",
    answer: "Yes. Interactive parts are marked \"use client\", and this FAQ block renders fine in a Server Component.",
  },
];

export default function FaqAccordionDemo() {
  return <FaqAccordion items={faqs} defaultValue={["item-0"]} className="max-w-xl" />;
}
