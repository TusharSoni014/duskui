import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * DuskUI Alert — a drop-in upgrade of the shadcn/ui Alert.
 *
 * Same parts, props and data-slot attributes as shadcn (Alert, AlertTitle,
 * AlertDescription, variants `default` and `destructive`) plus:
 * - Tinted status variants for dark UIs: `success`, `warning`, `info`.
 * - A soft glow on the leading icon and a top highlight on the surface.
 * - `AlertAction`: a top-right slot for a close button or menu; the text
 *   makes room for it automatically.
 * - Titles wrap instead of being clipped to one line.
 * CSS only, so it works in Server Components.
 */
const alertVariants = cva(
  [
    "relative grid w-full grid-cols-[0_1fr] items-start gap-y-1 rounded-xl border px-4 py-3.5 text-sm",
    "has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3",
    "has-data-[slot=alert-action]:pr-12",
    "shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]",
    "[&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current [&>svg]:drop-shadow-[0_0_6px_color-mix(in_oklab,currentColor_50%,transparent)]",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-card text-card-foreground [&>svg]:text-primary",
        destructive:
          "border-destructive/30 bg-destructive/[0.08] text-destructive *:data-[slot=alert-description]:text-destructive/85",
        success:
          "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300 *:data-[slot=alert-description]:text-emerald-100/70",
        warning:
          "border-amber-400/20 bg-amber-400/[0.06] text-amber-300 *:data-[slot=alert-description]:text-amber-100/70",
        info: "border-sky-400/20 bg-sky-400/[0.06] text-sky-300 *:data-[slot=alert-description]:text-sky-100/70",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface AlertProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof alertVariants> {}

/**
 * A callout for important messages. Put an optional lucide icon first, then
 * AlertTitle and/or AlertDescription. Uses role="alert" like shadcn; pass
 * role="status" for non-urgent messages so screen readers don't interrupt.
 */
function Alert({ className, variant, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      data-variant={variant ?? "default"}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

/** The alert's heading. */
function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-2 min-h-4 leading-snug font-medium tracking-tight", className)}
      {...props}
    />
  );
}

/** Supporting text. Paragraphs, lists and links inside are spaced for you. */
function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground [&_p]:leading-relaxed",
        "[&_a]:font-medium [&_a]:text-current [&_a]:underline [&_a]:underline-offset-4",
        className
      )}
      {...props}
    />
  );
}

/** Top-right slot for a close button or menu. The alert's text makes room for it. */
function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-2.5 right-2.5 flex items-center gap-1", className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, AlertAction, alertVariants };
