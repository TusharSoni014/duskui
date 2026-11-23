import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

export interface CardProps extends React.ComponentProps<"div"> {
  /** Render the child element instead of a `<div>` (Radix Slot), e.g. a link. */
  asChild?: boolean;
  /** Lift, brighten the border and show a focus ring on hover / focus. Use for clickable cards. */
  interactive?: boolean;
}

/**
 * DuskUI Card — a drop-in upgrade of the shadcn/ui Card.
 *
 * Same parts and data-slot attributes as shadcn (Card, CardHeader, CardTitle,
 * CardDescription, CardAction, CardContent, CardFooter) plus:
 * - A subtle top highlight and smooth border / shadow transitions.
 * - `interactive`: hover lift, mint-tinted border and a focus-visible ring for
 *   cards that are links or buttons (combine with `asChild`).
 * - `isolate`, so decorative layers placed at `-z-10` sit above the surface
 *   but below the content.
 * CSS only, so it works in Server Components.
 */
function Card({ className, asChild = false, interactive = false, ...props }: CardProps) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      data-slot="card"
      data-interactive={interactive || undefined}
      className={cn(
        "relative isolate flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground",
        "shadow-[inset_0_1px_0_rgb(255_255_255/0.04),0_1px_2px_rgb(0_0_0/0.3)]",
        "transition-[border-color,box-shadow,background-color,translate] duration-200 ease-out motion-reduce:transition-none",
        interactive && [
          "outline-none hover:-translate-y-0.5 hover:border-primary/25 motion-reduce:hover:translate-y-0",
          "hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_16px_40px_-16px_rgb(0_0_0/0.7),0_0_24px_-12px_var(--color-primary)]",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40",
        ],
        className
      )}
      {...props}
    />
  );
}

/** Top section. Lays out title, description and an optional CardAction in a grid. */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
}

/** The card's title. A `<div>` like shadcn — nest an `<h2>`/`<h3>` inside when it belongs in the page outline. */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

/** Muted supporting text under the title. */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

/** Top-right slot in the header for a button, menu or badge. */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  );
}

/** Main body. */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-6", className)} {...props} />;
}

/** Bottom row, usually for actions. */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
