import * as React from "react"
import { Slot, Slottable } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * DuskUI Badge — a drop-in upgrade of the shadcn/ui Badge.
 *
 * Same API and variants as shadcn (default, secondary, destructive, outline)
 * plus:
 * - Tinted status variants for dark UIs: `soft`, `success`, `warning`, `info`.
 * - `size`: sm, default, lg.
 * - `dot`: a leading status dot in the badge's text color (works with `asChild`).
 * - Smooth hover transitions when rendered as a link (`asChild`).
 * CSS only, so it works in Server Components.
 */
const badgeVariants = cva(
  [
    "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-md border font-medium",
    "transition-[color,background-color,border-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
    "[&>svg]:pointer-events-none [&>svg]:size-3",
  ],
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        soft: "border-primary/20 bg-primary/10 text-primary [a&]:hover:bg-primary/15",
        success:
          "border-emerald-400/20 bg-emerald-400/10 text-emerald-300 [a&]:hover:bg-emerald-400/15",
        warning:
          "border-amber-400/20 bg-amber-400/10 text-amber-300 [a&]:hover:bg-amber-400/15",
        info: "border-sky-400/20 bg-sky-400/10 text-sky-300 [a&]:hover:bg-sky-400/15",
      },
      size: {
        sm: "h-[1.125rem] px-1.5 text-[0.6875rem] [&>svg]:size-2.5",
        default: "px-2 py-0.5 text-xs",
        lg: "h-7 gap-1.5 px-2.5 text-sm [&>svg]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  /** Render the child element instead of a `<span>` (Radix Slot), e.g. a link. */
  asChild?: boolean
  /** Show a small leading dot in the current text color. */
  dot?: boolean
}

function Badge({
  className,
  variant,
  size,
  asChild = false,
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant ?? "default"}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {dot && (
        <span
          aria-hidden
          data-slot="badge-dot"
          className="size-1.5 shrink-0 rounded-full bg-current"
        />
      )}
      {/* Slottable lets the dot be merged into an `asChild` element. */}
      {asChild ? <Slottable>{children}</Slottable> : children}
    </Comp>
  )
}

export { Badge, badgeVariants }
