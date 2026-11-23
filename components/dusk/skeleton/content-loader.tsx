"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export interface ContentLoaderProps
  extends Omit<React.ComponentProps<"div">, "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd"> {
  /** Show `skeleton` instead of `children`. */
  loading: boolean;
  /** The placeholder. Build it from Skeleton or the skeleton presets, shaped like the content. */
  skeleton: React.ReactNode;
  /** Announced to screen readers while loading. */
  loadingLabel?: string;
  /** Announced once the content is in. Leave empty to stay quiet. */
  loadedLabel?: string;
  /** Fade the direct children of the content in one after another. */
  stagger?: boolean;
  /** Classes for the element that wraps `children`, e.g. "grid gap-4". */
  contentClassName?: string;
}

const swap = { type: "spring", duration: 0.3, bounce: 0 } as const;

/** Tracks an element's height so the wrapper can spring between skeleton and content sizes. */
function useMeasuredHeight<T extends HTMLElement>() {
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

/**
 * Swaps a skeleton for the real content. The two crossfade
 * while the wrapper's height springs from one to the other, so whatever sits
 * below glides instead of jumping. With `stagger`, the content's direct
 * children fade up one after another. The region is aria-busy while loading
 * and announces `loadingLabel` politely. Under reduced motion the height
 * snaps and only the opacity fades.
 */
export function ContentLoader({
  loading,
  skeleton,
  loadingLabel = "Loading",
  loadedLabel = "",
  stagger = false,
  contentClassName,
  className,
  children,
  ...props
}: ContentLoaderProps) {
  const reduceMotion = useReducedMotion();
  const [measureRef, height] = useMeasuredHeight<HTMLDivElement>();

  return (
    <div
      data-slot="content-loader"
      aria-busy={loading || undefined}
      className={cn("relative", className)}
      {...props}
    >
      <span className="sr-only" aria-live="polite">
        {loading ? loadingLabel : loadedLabel}
      </span>
      <motion.div
        className="overflow-hidden"
        initial={false}
        animate={{ height: height ?? "auto" }}
        transition={reduceMotion ? { duration: 0 } : swap}
      >
        <div ref={measureRef} className="relative">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={loading ? "skeleton" : "content"}
              aria-hidden={loading || undefined}
              className={loading ? undefined : contentClassName}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={swap}
            >
              {loading || !stagger ? (
                loading ? skeleton : children
              ) : (
                <motion.div
                  className="contents"
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.04, delayChildren: 0.03 } } }}
                >
                  {React.Children.map(children, (child) =>
                    child == null || typeof child === "boolean" ? child : (
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: reduceMotion ? 0 : 4 },
                          visible: { opacity: 1, y: 0, transition: swap },
                        }}
                      >
                        {child}
                      </motion.div>
                    )
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
