"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Card, type CardProps } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * A skeleton block with a light sweeping across it. Size it with classes
 * (`h-4 w-2/3`, `size-10 rounded-full`…). Static with reduced motion.
 */
export function Shimmer({ className, ...props }: React.ComponentProps<"div">) {
  const reduceMotion = useReducedMotion();
  return (
    <div
      aria-hidden
      data-slot="shimmer"
      className={cn("relative overflow-hidden rounded-md bg-white/[0.06]", className)}
      {...props}
    >
      {!reduceMotion && (
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.08),transparent)]"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.3 }}
        />
      )}
    </div>
  );
}

/** The default placeholder: avatar, title, subtitle and three text lines. */
export function CardSkeleton() {
  return (
    <>
      <div className="flex items-center gap-3 px-6">
        <Shimmer className="size-10 shrink-0 rounded-full" />
        <div className="grid flex-1 gap-2">
          <Shimmer className="h-4 w-1/2" />
          <Shimmer className="h-3 w-1/3" />
        </div>
      </div>
      <div className="grid gap-2 px-6">
        <Shimmer className="h-3" />
        <Shimmer className="h-3" />
        <Shimmer className="h-3 w-4/5" />
      </div>
    </>
  );
}

/** Measures an element's height so the card can spring between skeleton and content sizes. */
function useHeight<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const [height, setHeight] = React.useState<number>();
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setHeight(entry.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight)
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, height] as const;
}

export interface LoadingCardProps extends Omit<CardProps, "asChild"> {
  /** Show the skeleton instead of `children`. */
  loading?: boolean;
  /** Custom placeholder. Defaults to `<CardSkeleton />`. Build your own with `<Shimmer />`. */
  skeleton?: React.ReactNode;
  /** Text announced to screen readers while loading. */
  loadingLabel?: string;
}

const swap = { type: "spring", duration: 0.3, bounce: 0 } as const;

/**
 * A Card that shows a shimmering skeleton while `loading`, then crossfades the
 * real content in. The height springs between the two, so nothing below the
 * card jumps. Lay out children exactly like a normal Card (CardHeader,
 * CardContent, CardFooter…).
 */
export function LoadingCard({
  loading = false,
  skeleton = <CardSkeleton />,
  loadingLabel = "Loading",
  className,
  children,
  ...props
}: LoadingCardProps) {
  const [measureRef, height] = useHeight<HTMLDivElement>();

  return (
    <Card aria-busy={loading || undefined} className={cn("gap-0 py-0", className)} {...props}>
      <span className="sr-only" aria-live="polite">
        {loading ? loadingLabel : ""}
      </span>
      <motion.div
        className="overflow-hidden"
        initial={false}
        animate={{ height: height ?? "auto" }}
        transition={swap}
      >
        <div ref={measureRef} className="relative">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={loading ? "skeleton" : "content"}
              className="flex flex-col gap-6 py-6"
              aria-hidden={loading || undefined}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {loading ? skeleton : children}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </Card>
  );
}
