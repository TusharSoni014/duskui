"use client";

import * as React from "react";
import { useInView, usePageInView, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

type TypewriterTag = "span" | "p" | "div" | "strong" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface TypewriterProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** Phrases to type, in order. Restarts only when their content changes, so inline arrays are fine. */
  phrases: string[];
  /** Element to render. `span` (default) sits inline in a sentence; use a heading tag for titles. */
  as?: TypewriterTag;
  /** Milliseconds per typed character (slightly varied so it feels human). */
  typeSpeed?: number;
  /** Milliseconds per deleted character. */
  deleteSpeed?: number;
  /** How long a finished phrase stays on screen before it is deleted, in ms. */
  pause?: number;
  /** Delay before the very first keystroke, in ms. */
  startDelay?: number;
  /** Cycle forever. When `false` it stops on the last phrase. */
  loop?: boolean;
  /**
   * Type the first phrase from an empty line. By default the first phrase is
   * already written (and server-rendered), and the animation starts by deleting it.
   */
  typeFirst?: boolean;
  /** Caret style. */
  cursor?: "bar" | "block" | "underscore" | "none";
  /** Extra classes for the caret, e.g. a color. Defaults to the text color. */
  cursorClassName?: string;
  /** Wait until the text scrolls into view before typing. */
  startOnView?: boolean;
  /**
   * Text for screen readers and search engines. Defaults to every phrase joined
   * with ", " so nothing is hidden behind the animation.
   */
  label?: string;
}

type Step = { index: number; chars: number; deleting: boolean };

const CARET_CSS = `
@keyframes dusk-typewriter-blink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
.dusk-typewriter-caret[data-blink] { animation: dusk-typewriter-blink 1.06s step-end infinite }
@media (prefers-reduced-motion: reduce) { .dusk-typewriter-caret[data-blink] { animation: none } }
`;

const caretShape = {
  bar: "ml-[0.06em] w-[0.08em] h-[1em] translate-y-[0.12em]",
  block: "ml-[0.08em] w-[0.55em] h-[1em] translate-y-[0.12em] opacity-80",
  underscore: "ml-[0.06em] w-[0.55em] h-[0.09em]",
} as const;

/** Small deterministic jitter (no Math.random, so renders stay pure and repeatable). */
const jitter = (n: number) => 0.6 + ((n * 7919) % 9) / 10;

/**
 * Types and deletes a list of phrases with a blinking caret.
 *
 * Every phrase is stacked invisibly in the same grid cell, so the element is
 * always as wide and tall as its longest phrase: nothing around it shifts while
 * typing, and long phrases wrap cleanly. The full phrase list is in the DOM as
 * visually hidden text for search engines and screen readers; the animated copy
 * is `aria-hidden`. Typing pauses off-screen and in hidden tabs, and under
 * reduced motion a finished phrase is shown without animation.
 */
export function Typewriter({
  phrases,
  as = "span",
  typeSpeed = 70,
  deleteSpeed = 38,
  pause = 1800,
  startDelay = 400,
  loop = true,
  typeFirst = false,
  cursor = "bar",
  cursorClassName,
  startOnView = true,
  label,
  className,
  ...props
}: TypewriterProps) {
  const Comp = as as React.ElementType;
  const rootRef = React.useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const pageVisible = usePageInView();
  const inView = useInView(rootRef, { amount: 0.4 });

  // A content signature lets callers pass inline arrays without restarting every render.
  const signature = JSON.stringify(phrases);
  const list = React.useMemo(() => JSON.parse(signature) as string[], [signature]);

  const initial = React.useCallback(
    (): Step => ({ index: 0, chars: typeFirst ? 0 : (list[0]?.length ?? 0), deleting: false }),
    [list, typeFirst]
  );
  const [step, setStep] = React.useState<Step>(initial);
  const started = React.useRef(false);

  // Restart when the phrases change (adjusting state during render, no effect needed).
  const [prevSignature, setPrevSignature] = React.useState(signature);
  if (prevSignature !== signature) {
    setPrevSignature(signature);
    setStep(initial());
  }

  const count = list.length;
  const current = list[step.index] ?? "";
  const running = (!startOnView || inView) && pageVisible;

  // The typing state machine: one timeout per keystroke, always cleaned up.
  React.useEffect(() => {
    if (count === 0) return;
    const last = step.index === count - 1;

    let delay: number;
    let next: Step;

    if (reduceMotion) {
      // No typing: show a finished phrase (the last one when not looping).
      const target = loop ? 0 : count - 1;
      if (step.index === target && step.chars === list[target].length && !step.deleting) return;
      delay = 0;
      next = { index: target, chars: list[target].length, deleting: false };
    } else if (!running) {
      return;
    } else if (!step.deleting && step.chars < current.length) {
      delay = !started.current && step.chars === 0 ? startDelay : typeSpeed * jitter(step.chars + step.index);
      next = { ...step, chars: step.chars + 1 };
    } else if (!step.deleting) {
      // Phrase complete.
      if (!loop && last) return;
      delay = started.current ? pause : Math.max(startDelay, pause * 0.6);
      next = { ...step, deleting: true };
    } else if (step.chars > 0) {
      delay = deleteSpeed;
      next = { ...step, chars: step.chars - 1 };
    } else {
      delay = typeSpeed * 2;
      next = { index: (step.index + 1) % count, chars: 0, deleting: false };
    }

    const timer = setTimeout(() => {
      started.current = true;
      setStep(next);
    }, delay);
    return () => clearTimeout(timer);
  }, [step, list, count, current, running, reduceMotion, loop, pause, startDelay, typeSpeed, deleteSpeed]);

  const typing = step.chars > 0 && step.chars < current.length;
  const caret = (blink: boolean) =>
    cursor === "none" ? null : (
      <span
        data-blink={blink || undefined}
        className={cn(
          "dusk-typewriter-caret inline-block rounded-[1px] bg-current align-baseline opacity-80",
          caretShape[cursor],
          cursorClassName
        )}
      />
    );

  const stack = "[grid-area:1/1] whitespace-pre-wrap";

  return (
    <Comp
      ref={rootRef}
      data-slot="typewriter"
      className={cn(as === "span" || as === "strong" ? "inline-grid" : "grid", className)}
      {...props}
    >
      <style href="duskui-typewriter" precedence="duskui">
        {CARET_CSS}
      </style>

      {/* Full text for search engines and assistive tech; the animated copy below is decorative. */}
      <span className="sr-only">{label ?? list.join(", ")}</span>

      {/* Invisible copies reserve the size of the longest phrase, so nothing shifts while typing. */}
      {list.map((phrase, i) => (
        <span key={i} aria-hidden className={cn(stack, "invisible select-none")}>
          {phrase}
          {caret(false)}
        </span>
      ))}

      <span aria-hidden className={stack}>
        {current.slice(0, step.chars)}
        {caret(!typing && !step.deleting)}
      </span>
    </Comp>
  );
}
