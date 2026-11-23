"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const heightSpring = { type: "spring", bounce: 0, duration: 0.35 } as const;

/** Fully opaque down to `stop`%, then fading to transparent. Same shape both ways so Motion can tween it. */
const fadeMask = (stop: number) =>
  `linear-gradient(to bottom, rgba(0,0,0,1) ${stop}%, rgba(0,0,0,${stop >= 100 ? 1 : 0}) 100%)`;

function ShowMoreButton({
  expanded,
  controls,
  onClick,
  moreLabel,
  lessLabel,
  className,
}: {
  expanded: boolean;
  controls: string;
  onClick: () => void;
  moreLabel: React.ReactNode;
  lessLabel: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <button
      type="button"
      aria-expanded={expanded}
      aria-controls={controls}
      onClick={onClick}
      className={cn(
        "group/more inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-foreground outline-none",
        "transition-[color,box-shadow] duration-150 hover:text-foreground/80 focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className
      )}
    >
      <span className="relative grid">
        {/* Both labels share one grid cell so the button never changes width. */}
        <span className={cn("col-start-1 row-start-1 transition-opacity duration-150", expanded && "opacity-0")} aria-hidden={expanded}>
          {moreLabel}
        </span>
        <span className={cn("col-start-1 row-start-1 transition-opacity duration-150", !expanded && "opacity-0")} aria-hidden={!expanded}>
          {lessLabel}
        </span>
      </span>
      <motion.span
        aria-hidden
        className="flex"
        initial={false}
        animate={{ rotate: expanded ? 180 : 0 }}
        transition={reduceMotion ? { duration: 0 } : { type: "spring", bounce: 0, duration: 0.25 }}
      >
        <ChevronDownIcon className="size-4" />
      </motion.span>
    </button>
  );
}

export interface ShowMoreProps extends Omit<React.ComponentProps<"div">, "children"> {
  children: React.ReactNode;
  /** Height of the clamped preview, in px. */
  collapsedHeight?: number;
  /** Controlled state. */
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  moreLabel?: React.ReactNode;
  lessLabel?: React.ReactNode;
  /** Classes for the content wrapper (typography, spacing). */
  contentClassName?: string;
}

/**
 * Clamps long content to a preview that fades out at the bottom, with a
 * "Show more" toggle. The height springs between the preview and the full
 * content (Motion animates to `height: auto`, no measuring), and the fade
 * mask dissolves as it opens. The full text is always in the DOM, so it is
 * indexed and read by screen readers. The toggle hides itself when the
 * content already fits. Under reduced motion it snaps open and shut.
 */
export function ShowMore({
  children,
  collapsedHeight = 120,
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  moreLabel = "Show more",
  lessLabel = "Show less",
  className,
  contentClassName,
  ...props
}: ShowMoreProps) {
  const id = React.useId();
  const reduceMotion = useReducedMotion();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [uncontrolled, setUncontrolled] = React.useState(defaultExpanded);
  // Assume it overflows until measured, so the toggle doesn't pop in after hydration.
  const [overflows, setOverflows] = React.useState(true);
  const expanded = expandedProp ?? uncontrolled;

  React.useEffect(() => {
    const node = contentRef.current;
    if (!node) return;
    const observer = new ResizeObserver(() => {
      setOverflows(node.scrollHeight > collapsedHeight + 1);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [collapsedHeight]);

  const setExpanded = (next: boolean) => {
    if (expandedProp === undefined) setUncontrolled(next);
    onExpandedChange?.(next);
  };

  const clamped = overflows && !expanded;

  return (
    <div className={cn("flex flex-col items-start gap-2", className)} {...props}>
      <motion.div
        id={id}
        className="w-full overflow-hidden"
        initial={false}
        animate={{
          height: clamped ? collapsedHeight : "auto",
          maskImage: fadeMask(clamped ? 45 : 100),
        }}
        transition={reduceMotion ? { duration: 0 } : { height: heightSpring, default: { duration: 0.35, ease: "easeOut" } }}
      >
        <div ref={contentRef} className={cn("text-sm leading-relaxed text-muted-foreground", contentClassName)}>
          {children}
        </div>
      </motion.div>
      {overflows && (
        <ShowMoreButton
          expanded={expanded}
          controls={id}
          onClick={() => setExpanded(!expanded)}
          moreLabel={moreLabel}
          lessLabel={lessLabel}
        />
      )}
    </div>
  );
}

export interface ShowMoreListProps<T> extends Omit<React.ComponentProps<"div">, "children"> {
  items: T[];
  /** Renders one item's contents (inside an `li`). */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Stable key for an item. Defaults to its index. */
  getKey?: (item: T, index: number) => React.Key;
  /** How many items show before expanding. */
  initialCount?: number;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** Label for the expand button; receives the hidden count. */
  moreLabel?: (hidden: number) => React.ReactNode;
  lessLabel?: React.ReactNode;
  /** Classes for the `ul`. */
  listClassName?: string;
  /** Classes for every `li`. */
  itemClassName?: string;
}

/**
 * Shows the first `initialCount` items of a list and reveals the rest with
 * a staggered spring: each extra row grows in, fades and slides up, and they
 * fold away in reverse. One semantic `ul` throughout; the toggle reports how
 * many items are hidden. Under reduced motion rows appear without movement.
 */
export function ShowMoreList<T>({
  items,
  renderItem,
  getKey,
  initialCount = 3,
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  moreLabel = (hidden) => `Show ${hidden} more`,
  lessLabel = "Show less",
  className,
  listClassName,
  itemClassName,
  ...props
}: ShowMoreListProps<T>) {
  const id = React.useId();
  const reduceMotion = useReducedMotion();
  const [uncontrolled, setUncontrolled] = React.useState(defaultExpanded);
  const expanded = expandedProp ?? uncontrolled;
  const hidden = Math.max(0, items.length - initialCount);
  const visible = expanded ? items : items.slice(0, initialCount);

  const setExpanded = (next: boolean) => {
    if (expandedProp === undefined) setUncontrolled(next);
    onExpandedChange?.(next);
  };

  return (
    <div className={cn("flex flex-col items-start gap-2", className)} {...props}>
      <ul id={id} className={cn("flex w-full flex-col", listClassName)}>
        <AnimatePresence initial={false}>
          {visible.map((item, index) => {
            const extra = index >= initialCount;
            const order = index - initialCount;
            return (
              <motion.li
                key={getKey ? getKey(item, index) : index}
                className={cn("overflow-hidden", itemClassName)}
                initial={extra ? { height: 0, opacity: 0, y: reduceMotion ? 0 : 8 } : false}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{
                  height: 0,
                  opacity: 0,
                  y: reduceMotion ? 0 : 4,
                  transition: reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.2, ease: "easeIn", delay: Math.max(0, hidden - 1 - order) * 0.025 },
                }}
                transition={
                  reduceMotion
                    ? { duration: 0.15 }
                    : { height: { ...heightSpring, delay: order * 0.04 }, default: { duration: 0.3, delay: order * 0.04 + 0.04 } }
                }
              >
                {renderItem(item, index)}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
      {hidden > 0 && (
        <ShowMoreButton
          expanded={expanded}
          controls={id}
          onClick={() => setExpanded(!expanded)}
          moreLabel={moreLabel(hidden)}
          lessLabel={lessLabel}
        />
      )}
    </div>
  );
}
