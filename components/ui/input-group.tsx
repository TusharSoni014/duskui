"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/**
 * DuskUI Input Group — a drop-in upgrade of the shadcn/ui Input Group.
 *
 * Same parts, props and data-slot attributes as shadcn (InputGroup,
 * InputGroupAddon, InputGroupButton, InputGroupText, InputGroupInput,
 * InputGroupTextarea) plus:
 * - The whole group gets the Input's hover background, focus ring and red
 *   invalid ring, so icons and buttons read as part of one field.
 * - Addon icons brighten while the control is focused.
 * - Addons on `inline-start` / `inline-end` sit beside the control;
 *   `block-start` / `block-end` stack above or below it (toolbars, counters).
 * - Clicking an addon (outside its buttons) focuses the control.
 * - `data-disabled` on the group dims it.
 * CSS only, so nothing animates on the JS thread.
 */
function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group relative flex w-full min-w-0 items-center rounded-md border border-input shadow-xs outline-none dark:bg-input/30",
        "transition-[color,background-color,border-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
        "h-9 has-[>textarea]:h-auto",
        "dark:hover:bg-input/40",
        // Pull the control's padding in next to inline addons.
        "has-[>[data-align=inline-start]]:[&>input]:pl-2",
        "has-[>[data-align=inline-end]]:[&>input]:pr-2",
        "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3",
        // Focus ring on the group, driven by the control inside.
        "has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50",
        // Invalid state from any control or addon button with aria-invalid.
        "has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-destructive/20 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        "has-[[data-slot=input-group-control]:disabled]:opacity-50",
        className
      )}
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(
  [
    "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none",
    "transition-colors duration-150 ease-out motion-reduce:transition-none",
    "group-has-[[data-slot=input-group-control]:focus-visible]/input-group:[&>svg]:text-foreground",
    "[&>svg:not([class*='size-'])]:size-4 [&>kbd]:rounded-[calc(var(--radius)-5px)]",
    "group-data-[disabled=true]/input-group:opacity-50",
  ],
  {
    variants: {
      align: {
        "inline-start": "order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]",
        "inline-end": "order-last pr-3 has-[>button]:mr-[-0.45rem] has-[>kbd]:mr-[-0.35rem]",
        "block-start":
          "order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-2.5 [.border-b]:pb-3",
        "block-end": "order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-2.5 [.border-t]:pt-3",
      },
    },
    defaultVariants: { align: "inline-start" },
  }
);

/** Icons, text, keys or buttons attached to the control. `align` places it. */
function InputGroupAddon({
  className,
  align = "inline-start",
  onClick,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || (event.target as HTMLElement).closest("button, a, input, textarea, select")) return;
        event.currentTarget.parentElement
          ?.querySelector<HTMLElement>("[data-slot=input-group-control]")
          ?.focus();
      }}
      {...props}
    />
  );
}

const inputGroupButtonVariants = cva("flex items-center gap-2 text-sm shadow-none", {
  variants: {
    size: {
      xs: "h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-2 [&_svg:not([class*='size-'])]:size-3.5",
      sm: "h-8 gap-1.5 rounded-md px-2.5",
      "icon-xs": "size-6 rounded-[calc(var(--radius)-5px)] p-0",
      "icon-sm": "size-8 p-0",
    },
  },
  defaultVariants: { size: "xs" },
});

/** A compact DuskUI Button sized to sit inside the group. Defaults to `variant="ghost"`, `type="button"`. */
function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size"> & VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
}

/** Muted inline text inside an addon, e.g. a unit, a prefix or a counter. */
function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

const controlReset =
  "flex-1 rounded-none border-0 bg-transparent shadow-none hover:bg-transparent focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent dark:hover:bg-transparent read-only:bg-transparent disabled:opacity-100";

/** The DuskUI Input, unstyled so the group draws the border and ring. */
function InputGroupInput({ className, ...props }: React.ComponentProps<"input">) {
  return <Input data-slot="input-group-control" className={cn(controlReset, className)} {...props} />;
}

/** The DuskUI Textarea, unstyled so the group draws the border and ring. Still grows with its content. */
function InputGroupTextarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <Textarea data-slot="input-group-control" className={cn(controlReset, "resize-none py-3", className)} {...props} />
  );
}

export { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupInput, InputGroupTextarea };
