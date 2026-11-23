import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * DuskUI Button Group — a drop-in upgrade of the shadcn/ui Button Group.
 *
 * Same parts, props and data-slot attributes as shadcn (ButtonGroup,
 * ButtonGroupSeparator, ButtonGroupText) plus:
 * - Joined DuskUI Buttons press as one surface: the press scale is swapped
 *   for a 1px sink, so seams never pull apart mid-click.
 * - The focused or hovered segment rises above its neighbours, so its ring
 *   and border are never clipped.
 * - Works with Inputs, Select triggers and nested groups (nested groups get
 *   a gap, so a toolbar is one ButtonGroup of ButtonGroups).
 * - `orientation`: horizontal or vertical.
 * CSS only, so it works in Server Components.
 */
const buttonGroupVariants = cva(
  [
    "flex w-fit items-stretch",
    "[&>*]:relative [&>*]:hover:z-[1] [&>*]:focus-visible:z-10 [&>*:focus-within]:z-10",
    "[&>[data-slot=button]]:active:scale-100 [&>[data-slot=button]]:active:translate-y-px motion-reduce:[&>[data-slot=button]]:active:translate-y-0",
    "[&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
    "has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md",
    "has-[>[data-slot=button-group]]:gap-2",
  ],
  {
    variants: {
      orientation: {
        horizontal:
          "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none",
        vertical:
          "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none",
      },
    },
    defaultVariants: { orientation: "horizontal" },
  }
);

/** Joins Buttons, Inputs and Select triggers into one control. */
function ButtonGroup({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  );
}

/** A non-interactive segment for a label, prefix or unit. `asChild` to render a `<label>`. */
function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      data-slot="button-group-text"
      className={cn(
        "flex items-center gap-2 rounded-md border bg-muted px-4 text-sm font-medium text-muted-foreground shadow-xs",
        "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

/**
 * A hairline between segments — needed between filled buttons (default,
 * secondary) that have no border of their own. Decorative.
 */
function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <div
      aria-hidden
      data-slot="button-group-separator"
      data-orientation={orientation}
      className={cn(
        "relative z-[2] !m-0 shrink-0 self-stretch bg-input",
        "data-[orientation=vertical]:w-px data-[orientation=horizontal]:h-px",
        className
      )}
      {...props}
    />
  );
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants };
