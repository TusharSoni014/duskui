import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function AccordionBasicDemo() {
  return (
    <Accordion type="single" collapsible defaultValue="item-1" className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It follows the WAI-ARIA accordion pattern, with arrow-key navigation between
          triggers.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Does it work with my shadcn/ui code?</AccordionTrigger>
        <AccordionContent>
          It has the same parts, props and data-slots, so it drops into an existing project.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          The panel eases open, the answer fades in and the chevron turns with a small overshoot.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
