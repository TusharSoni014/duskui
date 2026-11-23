import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const spinnerVariants = cva("relative inline-flex shrink-0 items-center justify-center", {
  variants: {
    size: {
      sm: "size-3.5",
      default: "size-4",
      lg: "size-6",
      xl: "size-10",
    },
  },
  defaultVariants: { size: "default" },
});

export interface SpinnerProps
  extends Omit<React.ComponentProps<"span">, "children">,
    VariantProps<typeof spinnerVariants> {
  /** Text announced to screen readers. */
  label?: string;
}

/**
 * DuskUI Spinner — an accessible loading indicator.
 *
 * Like shadcn/ui's Spinner, plus:
 * - `role="status"` with a screen-reader-only `label` ("Loading" by default),
 *   so the busy state is announced instead of being a silent icon.
 * - A faint track with a rounded arc.
 * - `size`: sm, default, lg, xl. Colored with `currentColor` (use `text-*`).
 * - Under `prefers-reduced-motion` it turns slowly instead of spinning.
 * CSS only, so it works in Server Components.
 */
function Spinner({ className, size, label = "Loading", ...props }: SpinnerProps) {
  return (
    <span
      role="status"
      data-slot="spinner"
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className="size-full animate-spin [animation-duration:0.8s] motion-reduce:[animation-duration:2.4s]"
      >
        <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="2.5" className="opacity-20" />
        <path
          d="M12 2.5a9.5 9.5 0 0 1 9.5 9.5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}

export { Spinner, spinnerVariants };
