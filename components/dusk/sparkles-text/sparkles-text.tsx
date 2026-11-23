"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

type SparklesTextTag = "span" | "p" | "div" | "strong" | "em" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface SparklesTextProps extends React.HTMLAttributes<HTMLElement> {
  /** Element to render. Use a heading level for titles. */
  as?: SparklesTextTag;
  /** Sparkle colors (any CSS color). Each sparkle picks one. */
  colors?: string[];
  /** How many sparkles are on screen at once. */
  count?: number;
  /** Sparkle size range in px, `[min, max]`. */
  size?: [number, number];
  /** Seconds each sparkle lives, from popping in to fading out. */
  lifetime?: number;
  /** Change it for a different (but always repeatable) pattern of sparkles. */
  seed?: number;
}

type Sparkle = {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotate: number;
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DEFAULT_COLORS = ["rgb(255 255 255 / 0.8)", "rgb(255 255 255 / 0.5)"];

function makeSparkle(rand: () => number, id: number, colors: string[], [min, max]: [number, number]): Sparkle {
  return {
    id,
    // Spill a little past the box so sparkles sit around the words, not only on them.
    x: -4 + rand() * 108,
    y: -18 + rand() * 136,
    size: min + rand() * Math.max(0, max - min),
    color: colors[Math.floor(rand() * colors.length)] ?? DEFAULT_COLORS[0],
    rotate: rand() * 90,
  };
}

function SparkleStar({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className="block">
      <path d="M12 0c.6 5.9 3.3 9.4 12 12-8.7 2.6-11.4 6.1-12 12-.6-5.9-3.3-9.4-12-12 8.7-2.6 11.4-6.1 12-12Z" />
    </svg>
  );
}

/**
 * Text surrounded by small four-point stars that pop in and out one after
 * another. The stars come from a seeded generator inside an effect, so the
 * server renders the plain text, there is no hydration mismatch, and the same
 * `seed` always plays the same sequence.
 *
 * The text is one real element (selectable, indexable); the sparkle layer is
 * `aria-hidden`, pauses off-screen and in hidden tabs, and holds still under
 * reduced motion.
 */
export function SparklesText({
  as = "span",
  colors = DEFAULT_COLORS,
  count = 4,
  size = [6, 10],
  lifetime = 2,
  seed = 7,
  className,
  children,
  ...props
}: SparklesTextProps) {
  const Comp = as as React.ElementType;
  const ref = React.useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [sparkles, setSparkles] = React.useState<Sparkle[]>([]);

  // Stable keys for array props so inline literals don't restart the effect each render.
  const colorKey = colors.join("|");
  const [minSize, maxSize] = size;

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const palette = colorKey ? colorKey.split("|") : DEFAULT_COLORS;
    const range: [number, number] = [minSize, maxSize];
    const total = Math.max(0, Math.round(count));
    const rand = mulberry32(seed * 2654435761 + 11);
    let nextId = 0;
    const spawn = () => makeSparkle(rand, nextId++, palette, range);

    let timer = 0;
    let onScreen = true;
    // Replace the oldest sparkle on a steady beat, so roughly `count` are visible at any time.
    const beat = Math.max(60, (lifetime * 1000) / Math.max(1, total));

    const tick = () => {
      setSparkles((list) => (list.length ? [...list.slice(1), spawn()] : list));
    };
    const update = () => {
      const run = onScreen && !document.hidden && !reduceMotion && total > 0;
      if (run && !timer) timer = window.setInterval(tick, beat);
      if (!run && timer) {
        window.clearInterval(timer);
        timer = 0;
      }
    };

    // Deferred a frame so the first paint matches the server output exactly.
    const start = requestAnimationFrame(() => {
      setSparkles(Array.from({ length: total }, spawn));
      update();
    });

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      update();
    });
    observer.observe(el);
    document.addEventListener("visibilitychange", update);

    return () => {
      cancelAnimationFrame(start);
      window.clearInterval(timer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [colorKey, minSize, maxSize, count, lifetime, seed, reduceMotion]);

  return (
    <Comp ref={ref} data-slot="sparkles-text" className={cn("relative inline-block", className)} {...props}>
      <span aria-hidden className="pointer-events-none absolute inset-0 select-none">
        <AnimatePresence initial={false}>
          {sparkles.map((s, i) => (
            <motion.span
              key={s.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${s.x}%`, top: `${s.y}%`, zIndex: i % 2 ? 2 : 0 }}
              initial={reduceMotion ? false : { scale: 0, rotate: s.rotate - 90, opacity: 0 }}
              animate={
                reduceMotion
                  ? { scale: 0.85, rotate: s.rotate, opacity: 0.5 }
                  : {
                      scale: [0, 1, 0],
                      rotate: [s.rotate - 90, s.rotate, s.rotate + 90],
                      opacity: [0, 0.8, 0],
                    }
              }
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              transition={reduceMotion ? { duration: 0 } : { duration: lifetime, ease: "easeInOut", times: [0, 0.45, 1] }}
            >
              <SparkleStar size={s.size} color={s.color} />
            </motion.span>
          ))}
        </AnimatePresence>
      </span>
      <span className="relative z-[1]">{children}</span>
    </Comp>
  );
}
