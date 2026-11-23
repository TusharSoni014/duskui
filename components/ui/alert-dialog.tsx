"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import type { VariantProps } from "class-variance-authority";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * DuskUI Alert Dialog — a drop-in upgrade of the shadcn/ui Alert Dialog.
 *
 * Same parts, props and data-slot attributes as shadcn, plus:
 * - The DuskUI Dialog motion: fade + scale + short rise on an expo-out curve,
 *   a quicker exit, and a blurred backdrop.
 * - `size="sm"` on AlertDialogContent for compact, centered confirmations.
 * - `AlertDialogMedia`: an icon slot above the title.
 * - `variant` and `size` on AlertDialogAction / AlertDialogCancel (DuskUI
 *   Button variants), e.g. `variant="destructive"`.
 * - Long content scrolls inside the dialog.
 * - Under `prefers-reduced-motion` it only fades.
 * Unlike Dialog, clicking outside does NOT close it, and focus starts on
 * Cancel — an alert dialog always needs an explicit answer.
 * CSS only (tw-animate-css), powered by Radix for focus trap, Escape and aria.
 */
function AlertDialog({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

/** The element that opens the dialog. Use `asChild` to render your own Button. */
function AlertDialogTrigger({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
}

/** Portals the overlay and content to `document.body`. */
function AlertDialogPortal({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />;
}

/** The dimmed, blurred backdrop. Clicking it does nothing, by design. */
function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/65 backdrop-blur-[2px]",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-300",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-200",
        className
      )}
      {...props}
    />
  );
}

/** The dialog surface, centered on screen with its overlay. */
function AlertDialogContent({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
  /** `sm` is narrower and centers the header and stacks the footer buttons evenly. */
  size?: "default" | "sm";
}) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(
          "group/alert-dialog-content fixed top-[50%] left-[50%] z-50 grid max-h-[calc(100dvh-2rem)] w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 overflow-y-auto rounded-xl border bg-background p-6 outline-none",
          "data-[size=default]:sm:max-w-lg data-[size=sm]:sm:max-w-sm",
          "shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_24px_64px_-12px_rgb(0_0_0/0.7),0_0_0_1px_rgb(0_0_0/0.3)]",
          "ease-[cubic-bezier(0.16,1,0.3,1)]",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-2 data-[state=open]:duration-300",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.97] data-[state=closed]:duration-150",
          "motion-reduce:data-[state=open]:zoom-in-100 motion-reduce:data-[state=open]:slide-in-from-bottom-0 motion-reduce:data-[state=closed]:zoom-out-100",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}

/** Wraps the media, title and description. Centered on mobile and for `size="sm"`. */
function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        "flex flex-col items-center gap-1.5 text-center",
        "sm:group-data-[size=default]/alert-dialog-content:items-start sm:group-data-[size=default]/alert-dialog-content:text-left",
        className
      )}
      {...props}
    />
  );
}

/** Action row. Stacks on mobile with the primary action on top; `size="sm"` splits it evenly. */
function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        "group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2",
        className
      )}
      {...props}
    />
  );
}

/** A tinted icon badge above the title. Recolor it with classes, e.g. `bg-destructive/15 text-destructive`. */
function AlertDialogMedia({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(
        "mb-2 inline-grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary [&_svg:not([class*='size-'])]:size-5",
        className
      )}
      {...props}
    />
  );
}

/** Accessible title, announced when the dialog opens. Required by Radix. */
function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg leading-snug font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

/** Supporting text, linked to the dialog via aria-describedby. Required by Radix (or pass aria-describedby={undefined}). */
function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-sm leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  );
}

type ButtonStyleProps = Pick<VariantProps<typeof buttonVariants>, "variant" | "size">;

/** Confirms and closes the dialog. Styled as a DuskUI Button (`variant`, `size`). */
function AlertDialogAction({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> & ButtonStyleProps) {
  return (
    <AlertDialogPrimitive.Action
      data-slot="alert-dialog-action"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

/** Closes the dialog without acting. Receives focus when the dialog opens. Outline by default. */
function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> & ButtonStyleProps) {
  return (
    <AlertDialogPrimitive.Cancel
      data-slot="alert-dialog-cancel"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
