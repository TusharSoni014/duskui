"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * DuskUI Accordion — a drop-in upgrade of the shadcn/ui Accordion.
 *
 * Same parts, props and data-slot attributes as shadcn (Accordion,
 * AccordionItem, AccordionTrigger, AccordionContent) plus:
 * - A short ease-out height animation, with a quicker close.
 * - The answer fades in as the panel opens.
 * - The chevron rotates 180° when open.
 * - `icon` on AccordionTrigger to swap the chevron for your own indicator.
 * - Focus-visible ring on triggers; no hover underline.
 * - Under `prefers-reduced-motion` panels open and close instantly.
 * CSS only (tw-animate-css), powered by Radix for keyboard support and aria.
 */
function Accordion({ ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

/** One question / answer pair. `value` must be unique within the accordion. */
function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  );
}

/** The button that toggles its item. Wrapped in a heading (`h3`) by Radix. */
function AccordionTrigger({
  className,
  children,
  icon,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  /**
   * Replaces the chevron. It is not rotated for you: style it with
   * `group-data-[state=open]/accordion-trigger:` classes.
   */
  icon?: React.ReactNode;
}) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium outline-none",
          "transition-[color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        {icon !== undefined ? (
          <span
            data-slot="accordion-trigger-icon"
            aria-hidden
            className="pointer-events-none flex shrink-0 items-center"
          >
            {icon}
          </span>
        ) : (
          <ChevronDownIcon
            data-slot="accordion-trigger-icon"
            aria-hidden
            className={cn(
              "pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground",
              "transition-[rotate,color] duration-200 ease-out motion-reduce:transition-none",
              "group-hover/accordion-trigger:text-foreground",
              "group-data-[state=open]/accordion-trigger:rotate-180"
            )}
          />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

/** The collapsible panel. `className` styles the inner wrapper, like shadcn. */
function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        "group/accordion-content overflow-hidden text-sm",
        "ease-out data-[state=open]:animate-accordion-down data-[state=open]:duration-200",
        "data-[state=closed]:animate-accordion-up data-[state=closed]:duration-150",
        "motion-reduce:animate-none"
      )}
      {...props}
    >
      <div
        className={cn(
          "pt-0 pb-4 text-muted-foreground",
          "group-data-[state=open]/accordion-content:animate-in group-data-[state=open]/accordion-content:fade-in-0 group-data-[state=open]/accordion-content:duration-200",
          "motion-reduce:animate-none",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
