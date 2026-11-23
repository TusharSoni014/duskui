"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { ArrowUp } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface ScrollProgressProps extends React.ComponentProps<typeof ScrollArea> {
  /** Show a back-to-top button, ringed with progress, after this much of the content (0–1). `false` hides it. */
  backToTop?: number | false;
  /** Classes for the progress bar. */
  barClassName?: string;
}

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) (ref as React.RefObject<T | null>).current = value;
}

/**
 * A Scroll Area with a reading-progress bar. A thin bar along the top fills
 * as you scroll (spring-smoothed so it never stutters), and once you're past
 * `backToTop` a button rises in whose ring traces the same progress; it
 * scrolls back to the top. Driven by Motion's `useScroll` on the viewport, so
 * scrolling never re-renders React. Under reduced motion the bar tracks the
 * scroll exactly and the jump to the top is instant.
 */
export function ScrollProgress({
  backToTop = 0.2,
  barClassName,
  className,
  viewportRef,
  children,
  ...props
}: ScrollProgressProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const localRef = React.useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ container: localRef });
  const smooth = useSpring(scrollYProgress, { stiffness: 260, damping: 36, restDelta: 0.001 });
  const progress = reduceMotion ? scrollYProgress : smooth;
  const [showTop, setShowTop] = React.useState(false);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (backToTop !== false) setShowTop(value > backToTop);
  });

  const setViewport = React.useCallback(
    (node: HTMLDivElement | null) => {
      localRef.current = node;
      assignRef(viewportRef, node);
    },
    [viewportRef]
  );

  return (
    <div data-slot="scroll-progress" className={cn("relative overflow-hidden", className)}>
      <ScrollArea className="size-full" viewportRef={setViewport} {...props}>
        {children}
      </ScrollArea>

      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-white/5">
        <motion.div
          className={cn("h-full origin-left bg-primary", barClassName)}
          style={{ scaleX: progress }}
        />
      </div>

      <AnimatePresence>
        {backToTop !== false && showTop && (
          <motion.button
            key="top"
            type="button"
            aria-label="Back to top"
            onClick={() => localRef.current?.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })}
            className="absolute right-4 bottom-4 inline-flex size-10 items-center justify-center rounded-full border bg-background text-foreground shadow-md outline-none transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: "spring", duration: 0.25, bounce: 0.1 }}
          >
            <svg aria-hidden viewBox="0 0 40 40" className="absolute inset-0 size-full -rotate-90">
              <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/10" />
              <motion.circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ pathLength: progress }}
              />
            </svg>
            <ArrowUp className="size-4" aria-hidden />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
