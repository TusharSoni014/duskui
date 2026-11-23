"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type UseScrollOptions,
} from "motion/react";

import { cn } from "@/lib/utils";

type ScrollRevealTag = "p" | "div" | "blockquote" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface ScrollRevealTextProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** The text to reveal. Plain text only: it is split into words. */
  children: string;
  /** Element to render. */
  as?: ScrollRevealTag;
  /** Opacity of words that haven't been reached yet (0–1). */
  baseOpacity?: number;
  /**
   * When the reveal starts and ends, as Motion `useScroll` offsets
   * (`"<element edge> <viewport edge>"`). Default: starts when the top of the
   * text is 85% down the viewport, ends when its bottom reaches the middle.
   */
  offset?: UseScrollOptions["offset"];
  /** The scrolling element, if the text lives in a scroll container instead of the page. */
  container?: React.RefObject<HTMLElement | null>;
  /** Classes for each word, e.g. a highlight color. */
  wordClassName?: string;
}

const DEFAULT_OFFSET: UseScrollOptions["offset"] = ["start 0.85", "end 0.5"];

/**
 * A paragraph whose words light up one by one as it scrolls through the
 * viewport (or a scroll container).
 *
 * Each word's opacity is a Motion value derived from scroll progress, so
 * scrolling never re-renders React. The words stay one real, selectable text
 * node sequence (no duplicated copy). The server, no-JS visitors and
 * reduced-motion users get the fully revealed paragraph.
 */
export function ScrollRevealText({
  children,
  as = "p",
  baseOpacity = 0.18,
  offset = DEFAULT_OFFSET,
  container,
  wordClassName,
  className,
  ...props
}: ScrollRevealTextProps) {
  const Comp = as as React.ElementType;
  const ref = React.useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, container, offset });

  // 0 on the server and during hydration (everything fully visible), 1 once the reveal is live.
  const active = useMotionValue(0);
  React.useLayoutEffect(() => {
    active.set(reduceMotion ? 0 : 1);
  }, [reduceMotion, active]);

  // Split into words, keeping the original whitespace between them as plain text.
  const { tokens, wordCount } = React.useMemo(() => {
    let words = 0;
    const list = children
      .split(/(\s+)/)
      .filter(Boolean)
      .map((text) => (/^\s+$/.test(text) ? { text, word: -1 } : { text, word: words++ }));
    return { tokens: list, wordCount: words };
  }, [children]);

  return (
    <Comp ref={ref} data-slot="scroll-reveal-text" className={cn("relative", className)} {...props}>
      {tokens.map(({ text, word }, i) =>
        word < 0 ? (
          text
        ) : (
          <Word
            key={i}
            progress={scrollYProgress}
            active={active}
            start={word / wordCount}
            end={(word + 1) / wordCount}
            base={baseOpacity}
            className={wordClassName}
          >
            {text}
          </Word>
        )
      )}
    </Comp>
  );
}

function Word({
  progress,
  active,
  start,
  end,
  base,
  className,
  children,
}: {
  progress: MotionValue<number>;
  active: MotionValue<number>;
  start: number;
  end: number;
  base: number;
  className?: string;
  children: string;
}) {
  const opacity = useTransform([progress, active], ([p, on]: number[]) => {
    if (!on) return 1;
    const t = Math.min(1, Math.max(0, (p - start) / (end - start)));
    return base + (1 - base) * t;
  });
  return (
    <motion.span style={{ opacity }} className={className}>
      {children}
    </motion.span>
  );
}
