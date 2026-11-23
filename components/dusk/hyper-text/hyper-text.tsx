"use client";

import * as React from "react";
import { useInView, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

type HyperTextTag = "span" | "p" | "div" | "strong" | "code" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface HyperTextProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** The text to decode. Plain text only. */
  children: string;
  /** Element to render. Use a heading level for titles. */
  as?: HyperTextTag;
  /**
   * What starts the scramble:
   * - `"hover"`: pointer enter or keyboard focus
   * - `"inView"` (default): when it scrolls into view
   * - `"mount"`: as soon as it renders on the client
   */
  trigger?: "hover" | "inView" | "mount";
  /** Also replay on hover / focus when `trigger` is `"inView"` or `"mount"`. */
  replayOnHover?: boolean;
  /** Milliseconds from the first letter scrambling to the last one resolving. */
  duration?: number;
  /** Milliseconds of pure noise before letters start to resolve. */
  delay?: number;
  /** Characters the letters cycle through. Lowercase letters get lowercase noise. */
  characters?: string;
  /** In `"inView"` mode, play only the first time. When `false` it replays on every entry. */
  once?: boolean;
  /** Change it for a different (but repeatable) noise sequence. */
  seed?: number;
}

const DEFAULT_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
/** Repaint the noise ~20×/s: fast enough to read as decoding, slow enough not to strobe. */
const FRAME_MS = 50;

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

/** User-perceived characters, so emoji and accented letters aren't split apart. */
function graphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    return Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

type Cell = { real: HTMLElement; noise: HTMLElement; lower: boolean };

/**
 * Text that decodes itself: every letter cycles through random characters and
 * the word resolves left to right, on hover, in view or on mount.
 *
 * Each letter sits in a cell sized by the real glyph, and the noise is drawn
 * on top of it, so the line never changes width whatever the font. The server
 * renders the plain text (no randomness during render, so no hydration
 * mismatch); noise comes from a seeded generator and is written straight to
 * the DOM, with no React re-renders. Screen readers get the whole string from
 * a visually hidden copy, and reduced motion skips the effect.
 */
export function HyperText({
  children,
  as = "span",
  trigger = "inView",
  replayOnHover = true,
  duration = 800,
  delay = 0,
  characters = DEFAULT_CHARACTERS,
  once = true,
  seed = 1,
  className,
  onPointerEnter,
  onFocus,
  ...props
}: HyperTextProps) {
  const Comp = as as React.ElementType;
  const rootRef = React.useRef<HTMLElement>(null);
  const raf = React.useRef(0);
  const runs = React.useRef(0);
  const played = React.useRef(false);
  const reduceMotion = useReducedMotion();
  const inView = useInView(rootRef, { once, amount: 0.5 });

  const cells = React.useCallback((): Cell[] => {
    const root = rootRef.current;
    if (!root) return [];
    return Array.from(root.querySelectorAll<HTMLElement>("[data-hyper-cell]"), (cell) => {
      const real = cell.firstElementChild as HTMLElement;
      const ch = real.textContent ?? "";
      return { real, noise: cell.lastElementChild as HTMLElement, lower: ch !== ch.toUpperCase() };
    });
  }, []);

  const paint = React.useCallback(
    (list: Cell[], resolved: number, rand: () => number) => {
      const pool = Array.from(characters || DEFAULT_CHARACTERS);
      list.forEach((cell, i) => {
        if (i < resolved) {
          cell.real.style.color = "";
          cell.noise.textContent = "";
        } else {
          const ch = pool[Math.floor(rand() * pool.length)] ?? "";
          cell.real.style.color = "transparent";
          cell.noise.textContent = cell.lower ? ch.toLowerCase() : ch;
        }
      });
    },
    [characters]
  );

  const settle = React.useCallback(() => {
    cancelAnimationFrame(raf.current);
    raf.current = 0;
    const list = cells();
    paint(list, list.length, () => 0);
  }, [cells, paint]);

  const run = React.useCallback(() => {
    if (reduceMotion || raf.current) return;
    const list = cells();
    if (!list.length) return;
    played.current = true;
    runs.current += 1;
    const rand = mulberry32(seed * 2654435761 + runs.current * 977);
    const total = Math.max(1, duration);
    const start = performance.now();
    let lastPaint = -Infinity;

    const tick = (now: number) => {
      const t = now - start - delay;
      const done = t >= total;
      if (done || now - lastPaint >= FRAME_MS) {
        lastPaint = now;
        paint(list, done ? list.length : Math.floor((Math.max(0, t) / total) * list.length), rand);
      }
      raf.current = done ? 0 : requestAnimationFrame(tick);
    };
    // Paint the first noise frame synchronously so there's no flash of the resolved text.
    tick(start);
  }, [reduceMotion, cells, paint, seed, duration, delay]);

  // Mount mode starts before the first client paint; in-view mode pre-scrambles so
  // the reveal starts from noise. Both show the real text on the server and without JS.
  React.useLayoutEffect(() => {
    if (reduceMotion || played.current) return;
    if (trigger === "mount") run();
    else if (trigger === "inView") paint(cells(), 0, mulberry32(seed));
  }, [trigger, reduceMotion, run, paint, cells, seed, children]);

  React.useEffect(() => {
    if (trigger !== "inView" || reduceMotion) return;
    if (inView) run();
  }, [trigger, inView, reduceMotion, run]);

  // Stop and show the real text on unmount, text change, or when reduced motion turns on.
  React.useEffect(() => settle, [settle, children]);
  React.useEffect(() => {
    if (reduceMotion) settle();
  }, [reduceMotion, settle]);

  const hoverable = trigger === "hover" || replayOnHover;

  // Inside a link or button, hovering or focusing the whole control plays it too
  // (the control's padding is outside this element, and focus doesn't reach it).
  React.useEffect(() => {
    const control = rootRef.current?.parentElement?.closest<HTMLElement>("a[href], button, [role='button'], summary");
    if (!hoverable || !control) return;
    control.addEventListener("pointerenter", run);
    control.addEventListener("focus", run);
    return () => {
      control.removeEventListener("pointerenter", run);
      control.removeEventListener("focus", run);
    };
  }, [hoverable, run]);

  const words = children.split(/(\s+)/).filter(Boolean);

  return (
    <Comp
      ref={rootRef}
      data-slot="hyper-text"
      className={cn(as === "span" || as === "strong" || as === "code" ? "inline-block" : "block", className)}
      onPointerEnter={(e: React.PointerEvent<HTMLElement>) => {
        if (hoverable) run();
        onPointerEnter?.(e);
      }}
      onFocus={(e: React.FocusEvent<HTMLElement>) => {
        if (hoverable) run();
        onFocus?.(e);
      }}
      {...props}
    >
      <span className="sr-only">{children}</span>
      <span aria-hidden>
        {words.map((word, i) =>
          /^\s+$/.test(word) ? (
            word
          ) : (
            // Letters of a word stay together so lines only break between words.
            <span key={i} className="inline-block whitespace-pre">
              {graphemes(word).map((char, j) => (
                <span key={j} data-hyper-cell className="relative inline-block">
                  <span>{char}</span>
                  <span className="pointer-events-none absolute inset-0 select-none text-center" />
                </span>
              ))}
            </span>
          )
        )}
      </span>
    </Comp>
  );
}
