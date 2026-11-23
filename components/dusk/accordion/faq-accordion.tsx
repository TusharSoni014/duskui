import * as React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: React.ReactNode;
  /** Plain-text answer for structured data when `answer` is JSX. */
  answerText?: string;
  /** Stable id for the item. Defaults to its index. */
  value?: string;
}

export interface FaqAccordionProps extends Omit<React.ComponentProps<"div">, "defaultValue" | "dir"> {
  items: FaqItem[];
  /** Allow several answers open at once. */
  multiple?: boolean;
  /** Values (or `item-<index>`) open on first render. */
  defaultValue?: string[];
  /** Prefix each question with 01, 02… */
  numbered?: boolean;
  /**
   * Emit schema.org FAQPage JSON-LD for rich results. Uses `answer` when it is
   * a string, otherwise `answerText`; items with neither are skipped.
   */
  jsonLd?: boolean;
}

/** The + that folds into a − : the vertical bar rotates flat while the badge spins and fills. */
function PlusMinus() {
  return (
    <span
      className={cn(
        "relative grid size-7 place-items-center rounded-full border border-white/10 text-muted-foreground",
        "transition-[rotate,background-color,border-color,color] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none",
        "group-hover/accordion-trigger:border-white/20 group-hover/accordion-trigger:text-foreground",
        "group-data-[state=open]/accordion-trigger:rotate-180 group-data-[state=open]/accordion-trigger:border-primary",
        "group-data-[state=open]/accordion-trigger:bg-primary group-data-[state=open]/accordion-trigger:text-primary-foreground"
      )}
    >
      <span className="absolute h-[1.5px] w-3 rounded-full bg-current" />
      <span
        className={cn(
          "absolute h-3 w-[1.5px] rounded-full bg-current",
          "transition-[rotate] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none",
          "group-data-[state=open]/accordion-trigger:rotate-90"
        )}
      />
    </span>
  );
}

function faqJsonLd(items: FaqItem[]) {
  const entities = items.flatMap((item) => {
    const text = typeof item.answer === "string" ? item.answer : item.answerText;
    return text
      ? [{ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text } }]
      : [];
  });
  if (!entities.length) return null;
  // Escape `<` so answer text can never close the script tag.
  return JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: entities }).replace(
    /</g,
    "\\u003c"
  );
}

/**
 * A data-driven FAQ section: numbered questions, a plus that morphs into a
 * minus, answers that ease open, and optional FAQPage JSON-LD so the questions
 * can show up as rich results. No hooks, so it renders in Server Components
 * (the JSON-LD lands in the initial HTML). Built on the DuskUI Accordion (Radix).
 */
export function FaqAccordion({
  items,
  multiple = false,
  defaultValue,
  numbered = true,
  jsonLd = false,
  className,
  ...props
}: FaqAccordionProps) {
  const schema = jsonLd ? faqJsonLd(items) : null;
  const rows = items.map((item, index) => {
    const value = item.value ?? `item-${index}`;
    return (
      <AccordionItem
        key={value}
        value={value}
        className="border-white/10 last:border-b"
      >
        <AccordionTrigger
          icon={<PlusMinus />}
          className="items-center py-5 text-base hover:text-foreground"
        >
          <span className="flex items-baseline gap-4">
            {numbered && (
              <span
                aria-hidden
                className="font-mono text-xs text-muted-foreground tabular-nums transition-colors duration-300 group-data-[state=open]/accordion-trigger:text-primary"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            )}
            <span>{item.question}</span>
          </span>
        </AccordionTrigger>
        <AccordionContent className={cn("pb-5 leading-relaxed", numbered && "pl-[1.875rem]")}>
          {item.answer}
        </AccordionContent>
      </AccordionItem>
    );
  });

  return (
    <div data-slot="faq-accordion" className={cn("w-full", className)} {...props}>
      {multiple ? (
        <Accordion type="multiple" defaultValue={defaultValue} className="border-t border-white/10">
          {rows}
        </Accordion>
      ) : (
        <Accordion
          type="single"
          collapsible
          defaultValue={defaultValue?.[0]}
          className="border-t border-white/10"
        >
          {rows}
        </Accordion>
      )}
      {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />}
    </div>
  );
}
