"use client";

import * as React from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type SwipeDirection = "left" | "right";

export interface CardStackProps<T> extends Omit<React.ComponentProps<"div">, "children" | "onChange"> {
  /** The data for each card. */
  items: T[];
  /** Renders the content of one card. */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Stable key for an item. Defaults to its index. */
  getKey?: (item: T, index: number) => React.Key;
  /** Start over from the first card after the last one. */
  loop?: boolean;
  /** How many cards are visible in the stack. */
  visible?: number;
  /** How far each card behind peeks out below the one in front, in px. */
  offset?: number;
  /** How much smaller each card behind is, from 0 to 1. */
  scaleStep?: number;
  /** Drag distance in px that counts as a swipe. A fast flick also counts. */
  threshold?: number;
  /** Let people drag the top card away. */
  draggable?: boolean;
  /** Show the swipe left / swipe right buttons. */
  controls?: boolean;
  /** Called when a card leaves the stack. */
  onSwipe?: (direction: SwipeDirection, item: T, index: number) => void;
  /** Called once the last card has gone (only when `loop` is off). */
  onEnd?: () => void;
  /** Shown when every card has been swiped (only when `loop` is off). */
  empty?: React.ReactNode;
  /** Accessible labels for the buttons. */
  labels?: { left?: string; right?: string };
  /** Accessible name of the stack. */
  label?: string;
  /** Classes for every card. */
  cardClassName?: string;
}

type Exit = { direction: 1 | -1; distance: number; reduce: boolean };

const spring = { type: "spring", stiffness: 320, damping: 30, mass: 0.8 } as const;
const fade = { duration: 0.2, ease: "easeOut" } as const;
/** Reduced motion: cards snap into place and only the opacity crossfades. */
const crossfade = { default: { duration: 0 }, opacity: fade } as const;

function StackCard({
  depth,
  offset,
  scaleStep,
  draggable,
  threshold,
  reduce,
  onSwipe,
  className,
  children,
  label,
}: {
  depth: number;
  offset: number;
  scaleStep: number;
  draggable: boolean;
  threshold: number;
  reduce: boolean;
  onSwipe: (direction: 1 | -1, distance: number) => void;
  className?: string;
  children: React.ReactNode;
  label: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 0, 240], [-14, 0, 14]);
  const isTop = depth === 0;

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const swiped = Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > 600;
    if (swiped) {
      const direction = (info.offset.x || info.velocity.x) > 0 ? 1 : -1;
      onSwipe(direction, (ref.current?.offsetWidth ?? 320) + 160);
    } else {
      animate(x, 0, reduce ? { duration: 0 } : spring);
    }
  };

  return (
    <motion.div
      ref={ref}
      role="group"
      aria-roledescription="card"
      aria-label={label}
      aria-hidden={!isTop || undefined}
      inert={!isTop || undefined}
      data-slot="card-stack-card"
      className={cn(
        "relative [grid-area:1/1] rounded-xl border border-white/10 bg-card shadow-lg shadow-black/30 outline-none",
        isTop && draggable && "cursor-grab touch-pan-y active:cursor-grabbing",
        className
      )}
      style={{ x, rotate: reduce ? 0 : rotate, transformOrigin: "50% 100%" }}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: (depth + 1) * offset, scale: 1 - (depth + 1) * scaleStep }}
      animate={
        reduce
          ? { opacity: 1, y: depth * offset, scale: 1 - depth * scaleStep, transition: crossfade }
          : { opacity: 1, y: depth * offset, scale: 1 - depth * scaleStep, transition: spring }
      }
      variants={{
        exit: (exit: Exit) =>
          exit.reduce
            ? { opacity: 0, transition: fade }
            : {
                x: exit.direction * exit.distance,
                rotate: exit.direction * 18,
                opacity: 0,
                transition: { ...spring, opacity: { duration: 0.3, delay: 0.1 } },
              },
      }}
      exit="exit"
      drag={isTop && draggable ? "x" : false}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

/** A stack of cards where the top one can be swiped left or right, by drag, buttons or arrow keys, while the rest spring forward. */
export function CardStack<T>({
  items,
  renderItem,
  getKey,
  loop = true,
  visible = 3,
  offset = 14,
  scaleStep = 0.05,
  threshold = 100,
  draggable = true,
  controls = true,
  onSwipe,
  onEnd,
  empty,
  labels,
  label = "Card stack",
  cardClassName,
  className,
  onKeyDown,
  ...props
}: CardStackProps<T>) {
  const reduce = useReducedMotion() ?? false;
  const [state, setState] = React.useState<{ position: number; exit: Exit }>({
    position: 0,
    exit: { direction: 1, distance: 480, reduce: false },
  });
  const count = items.length;
  const { position } = state;
  const finished = !loop && position >= count;
  const depth = Math.max(1, Math.round(visible));

  // `position` only grows, so each card keeps one React identity while it moves forward.
  const cards: { slot: number; index: number; item: T }[] = [];
  if (count > 0) {
    for (let i = depth - 1; i >= 0; i--) {
      const slot = position + i;
      if (!loop && slot >= count) continue;
      const index = slot % count;
      cards.push({ slot, index, item: items[index] });
    }
  }

  const swipe = (direction: 1 | -1, distance = 480) => {
    if (count === 0 || finished) return;
    const index = position % count;
    setState({ position: position + 1, exit: { direction, distance, reduce } });
    onSwipe?.(direction > 0 ? "right" : "left", items[index], index);
    if (!loop && position + 1 >= count) onEnd?.();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === "ArrowLeft") swipe(-1);
    else if (event.key === "ArrowRight") swipe(1);
    else return;
    event.preventDefault();
  };

  const current = count ? (position % count) + 1 : 0;
  const status = finished ? "No more cards" : `Card ${current} of ${count}`;
  const leftLabel = labels?.left ?? "Swipe left";
  const rightLabel = labels?.right ?? "Swipe right";

  return (
    <div
      data-slot="card-stack"
      role="region"
      aria-roledescription="card stack"
      aria-label={label}
      aria-keyshortcuts="ArrowLeft ArrowRight"
      tabIndex={0}
      className={cn(
        "group/stack flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-4 focus-visible:ring-offset-background",
        className
      )}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <div
        className="grid w-full"
        // Room for the cards peeking out below, so the stack never changes height.
        style={{ paddingBottom: (depth - 1) * offset }}
      >
        <AnimatePresence initial={false} custom={state.exit}>
          {cards.map(({ slot, index, item }) => {
            const d = slot - position;
            return (
              <StackCard
                key={`${slot}-${getKey ? getKey(item, index) : index}`}
                depth={d}
                offset={offset}
                scaleStep={scaleStep}
                draggable={draggable}
                threshold={threshold}
                reduce={reduce}
                onSwipe={swipe}
                className={cardClassName}
                label={`${index + 1} of ${count}`}
              >
                {renderItem(item, index)}
              </StackCard>
            );
          })}
        </AnimatePresence>
        {(finished || count === 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.15 } }}
            className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-muted-foreground [grid-area:1/1]"
          >
            {empty ?? "No more cards"}
          </motion.div>
        )}
      </div>

      {controls && (
        <div className="flex items-center gap-4">
          <StackButton label={leftLabel} disabled={finished || count === 0} onClick={() => swipe(-1)}>
            <ArrowLeft />
          </StackButton>
          <span aria-hidden className="min-w-14 text-center font-mono text-xs tabular-nums text-muted-foreground">
            {finished ? `${count}/${count}` : `${current}/${count}`}
          </span>
          <StackButton label={rightLabel} disabled={finished || count === 0} onClick={() => swipe(1)}>
            <ArrowRight />
          </StackButton>
        </div>
      )}

      <p className="sr-only" aria-live="polite" aria-atomic>
        {status}
      </p>
    </div>
  );
}

function StackButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-disabled={disabled || undefined}
      onClick={() => {
        if (!disabled) onClick();
      }}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-card text-foreground outline-none",
        "transition-[color,background-color,border-color,transform] duration-150 hover:border-white/20 hover:bg-white/[0.04] hover:text-foreground active:scale-[0.97]",
        "focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none motion-reduce:active:scale-100",
        "aria-disabled:cursor-not-allowed aria-disabled:opacity-40 aria-disabled:hover:border-white/10 aria-disabled:hover:text-foreground",
        "[&_svg]:size-4"
      )}
    >
      {children}
    </button>
  );
}
