"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion, type Transition } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * DuskUI Button — a drop-in upgrade of the shadcn/ui Button.
 *
 * Same API as shadcn (variant, size, asChild) plus:
 * - `loading`: crossfades content to a spinner WITHOUT changing the width.
 *   The button stays focusable (aria-disabled + aria-busy) instead of being
 *   `disabled`, so keyboard and screen-reader users don't lose their place.
 * - `loadingText`: optional label shown next to the spinner.
 * - Tactile press feedback (CSS only, so it also works with `asChild`).
 * - Respects `prefers-reduced-motion`.
 */
const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium select-none outline-none",
    "transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-out",
    "active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100",
    "disabled:pointer-events-none disabled:opacity-50 aria-busy:cursor-wait",
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_1px_2px_rgb(0_0_0/0.25)] hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        soft: "bg-primary/10 text-primary hover:bg-primary/20",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline active:scale-100",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 gap-1.5 px-3",
        lg: "h-10 px-6",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const contentTransition: Transition = {
  type: "spring",
  duration: 0.3,
  bounce: 0,
};

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  /** Render the child element instead of a `<button>` (Radix Slot). Loading is not supported with `asChild`. */
  asChild?: boolean;
  /** Show a spinner and block clicks. The button keeps its width. */
  loading?: boolean;
  /** Optional text rendered next to the spinner while loading. */
  loadingText?: React.ReactNode;
  /** Custom spinner icon. Receives a `className`. */
  loaderIcon?: React.ComponentType<{ className?: string }>;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  loadingText,
  loaderIcon: LoaderIcon = Loader2,
  children,
  onClick,
  ...props
}: ButtonProps) {
  const dataAttrs = {
    "data-slot": "button",
    "data-variant": variant ?? "default",
    "data-size": size ?? "default",
  };

  if (asChild) {
    return (
      <Slot
        {...dataAttrs}
        className={cn(buttonVariants({ variant, size, className }))}
        onClick={onClick}
        {...props}
      >
        {children}
      </Slot>
    );
  }

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    if (loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      {...dataAttrs}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      aria-disabled={loading || props.disabled || undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={handleClick}
      {...props}
    >
      {/* Both layers share one grid cell, so the button never changes width. */}
      <span className="grid place-items-center [gap:inherit]">
        <motion.span
          data-slot="button-content"
          className="col-start-1 row-start-1 inline-flex items-center justify-center [gap:inherit]"
          initial={false}
          animate={
            loading
              ? { opacity: 0, y: -6, filter: "blur(2px)" }
              : // Clear the filter when idle: a filter makes this span the
                // containing block for absolutely positioned children.
                { opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }
          }
          transition={contentTransition}
          aria-hidden={loading || undefined}
        >
          {children}
        </motion.span>
        <AnimatePresence initial={false}>
          {loading && (
            <motion.span
              key="loader"
              data-slot="button-loader"
              className="col-start-1 row-start-1 inline-flex items-center justify-center [gap:inherit]"
              initial={{ opacity: 0, y: 6, filter: "blur(2px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 6, filter: "blur(2px)" }}
              transition={contentTransition}
            >
              <LoaderIcon className="animate-spin" aria-hidden />
              {loadingText ? (
                <span>{loadingText}</span>
              ) : (
                <span className="sr-only">Loading</span>
              )}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </button>
  );
}

/** Button with Motion props (`whileHover`, `animate`, variants…). Use it to build animated blocks. */
const MotionButton = motion.create(Button);
type MotionButtonProps = Omit<React.ComponentProps<typeof MotionButton>, "children"> & {
  children?: React.ReactNode;
};

export { Button, MotionButton, buttonVariants, type MotionButtonProps };
