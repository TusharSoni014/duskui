import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * DuskUI Empty — an empty state for lists, tables, search results and inboxes.
 *
 * Same parts and data-slot attributes as shadcn/ui's Empty (Empty,
 * EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent) plus:
 * - A dashed outline with a faint mint glow at the top, for dark surfaces.
 * - `EmptyMedia variant="icon"`: a glassy tile with a mint-tinted icon and a
 *   soft halo. `variant="default"` leaves your illustration untouched.
 * - `outline={false}` drops the dashed border to sit inside a card.
 * CSS only, so it works in Server Components.
 */
function Empty({
  className,
  outline = true,
  ...props
}: React.ComponentProps<"div"> & {
  /** Draw the dashed border and glow. Turn off when the empty state sits inside a card. */
  outline?: boolean;
}) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "relative isolate flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-xl p-6 text-center text-balance md:p-12",
        outline && [
          "border border-dashed border-white/10",
          "bg-[radial-gradient(120%_70%_at_50%_0%,color-mix(in_oklab,var(--color-primary)_6%,transparent),transparent_70%)]",
        ],
        className
      )}
      {...props}
    />
  );
}

/** Groups the media, title and description. */
function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn("flex max-w-sm flex-col items-center gap-2 text-center", className)}
      {...props}
    />
  );
}

const emptyMediaVariants = cva(
  "relative mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: [
          "size-12 rounded-xl border border-white/10 bg-linear-to-b from-white/[0.08] to-white/[0.02] text-primary",
          "shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_8px_24px_-8px_rgb(0_0_0/0.6),0_0_32px_-10px_var(--color-primary)]",
          "[&_svg:not([class*='size-'])]:size-6",
        ],
      },
    },
    defaultVariants: { variant: "default" },
  }
);

/** The icon or illustration. Use `variant="icon"` for a single icon in a tile. */
function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  );
}

/** The headline. A `<div>` like shadcn — nest an `<h2>`/`<h3>` when it belongs in the page outline. */
function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn("text-lg font-medium tracking-tight", className)}
      {...props}
    />
  );
}

/** Supporting text. Links inside are underlined and turn mint on hover. */
function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="empty-description"
      className={cn(
        "text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  );
}

/** Actions or extra content under the header, e.g. buttons or a search field. */
function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn("flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance", className)}
      {...props}
    />
  );
}

export { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia, emptyMediaVariants };
