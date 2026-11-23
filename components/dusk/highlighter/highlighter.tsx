"use client";

import * as React from "react";
import { animate, useInView, useReducedMotion, type AnimationPlaybackControls } from "motion/react";

import { cn } from "@/lib/utils";

type HighlighterTag = "span" | "mark" | "strong" | "em" | "b" | "i";

export type HighlighterAction = "highlight" | "underline" | "circle" | "strike-through" | "box";

export interface HighlighterProps extends React.HTMLAttributes<HTMLElement> {
  /** Inline content to annotate. It can wrap across lines. */
  children: React.ReactNode;
  /** Element to render. `mark` is a good semantic choice for highlights. */
  as?: HighlighterTag;
  /** How the annotation is drawn. */
  action?: HighlighterAction;
  /** Stroke color (any CSS color). Defaults to translucent primary for `highlight`, primary otherwise. */
  color?: string;
  /** Line thickness in px. Ignored by `highlight`, which follows the text height. */
  strokeWidth?: number;
  /** How many hand-drawn passes. Defaults to 1 for `highlight` and 2 otherwise. */
  iterations?: number;
  /** Seconds to draw the whole annotation (every line and pass). */
  duration?: number;
  /** Seconds to wait after its turn comes. */
  delay?: number;
  /** Extra room around the text, in px. */
  padding?: number;
  /** Wait for highlighters that entered the view before this one, so they draw one after another. */
  sequence?: boolean;
  /** Change it for a different (but repeatable) hand-drawn wobble. */
  seed?: number;
}

type Box = { x: number; y: number; w: number; h: number };

const SVG_NS = "http://www.w3.org/2000/svg";
/** Dash pattern that hides the whole path, caps included, at an offset of HIDDEN_OFFSET. */
const DASH = "1 1.1";
const HIDDEN_OFFSET = 1.05;

/* Highlighters that come into view together draw in document order, one after another. */
let queueEnd = 0;
function reserveTurn(ms: number) {
  const now = performance.now();
  const start = Math.max(now, queueEnd);
  const end = start + ms;
  queueEnd = end;
  return {
    wait: start - now,
    /** Give the slot back if nothing queued after it (e.g. unmounted before its turn). */
    release: () => {
      if (queueEnd === end) queueEnd = start;
    },
  };
}

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

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** One box per visual line, relative to `origin`. Inline content can return several rects per line. */
function lineBoxes(el: HTMLElement, origin: DOMRect): Box[] {
  const boxes: Box[] = [];
  for (const r of Array.from(el.getClientRects())) {
    if (r.width < 0.5 || r.height < 0.5) continue;
    const last = boxes[boxes.length - 1];
    const y = r.top - origin.top;
    if (last && Math.abs(last.y - y) < r.height / 2) {
      const right = Math.max(last.x + last.w, r.right - origin.left);
      last.x = Math.min(last.x, r.left - origin.left);
      last.w = right - last.x;
      last.h = Math.max(last.h, r.height);
    } else {
      boxes.push({ x: r.left - origin.left, y, w: r.width, h: r.height });
    }
  }
  return boxes;
}

const f = (n: number) => n.toFixed(1);

/** Hand-drawn path data for one pass of an annotation. */
function shapes(action: HighlighterAction, boxes: Box[], pad: number, rand: () => number): { d: string; h: number }[] {
  const j = (amount: number) => (rand() - 0.5) * 2 * amount;

  // A slightly wavy stroke from left to right at a given height of each line.
  const stroke = (b: Box, at: number, wobble: number, inset = 0) => {
    const x0 = b.x - pad + inset + j(2);
    const x1 = Math.max(x0 + 1, b.x + b.w + pad - inset + j(2));
    const y = b.y + b.h * at;
    const y0 = y + j(wobble);
    const y1 = y + j(wobble);
    const c1x = x0 + (x1 - x0) * 0.33;
    const c2x = x0 + (x1 - x0) * 0.66;
    return `M${f(x0)} ${f(y0)} C${f(c1x)} ${f(y + j(wobble))} ${f(c2x)} ${f(y + j(wobble))} ${f(x1)} ${f(y1)}`;
  };

  switch (action) {
    case "highlight":
      return boxes.map((b) => ({ d: stroke(b, 0.52, b.h * 0.05), h: b.h }));
    case "underline":
      return boxes.map((b) => ({ d: stroke(b, 0.95, 1.5), h: b.h }));
    case "strike-through":
      return boxes.map((b) => ({ d: stroke(b, 0.55, 1.5), h: b.h }));
    case "box":
      return boxes.map((b) => {
        const l = b.x - pad - 2;
        const r = b.x + b.w + pad + 2;
        const t = b.y - pad * 0.5;
        const btm = b.y + b.h + pad * 0.5;
        const p = (x: number, y: number) => `${f(x + j(1.5))} ${f(y + j(1.5))}`;
        // Four sides, ending a little past the start like a quick pen box.
        const d = `M${p(l, t)} L${p(r, t)} L${p(r, btm)} L${p(l, btm)} L${p(l, t)} L${p(l + Math.min(12, b.w * 0.2), t)}`;
        return { d, h: b.h };
      });
    case "circle": {
      if (!boxes.length) return [];
      const left = Math.min(...boxes.map((b) => b.x));
      const top = Math.min(...boxes.map((b) => b.y));
      const right = Math.max(...boxes.map((b) => b.x + b.w));
      const bottom = Math.max(...boxes.map((b) => b.y + b.h));
      const cx = (left + right) / 2;
      const cy = (top + bottom) / 2;
      const rx = (right - left) / 2 + pad + 6;
      const ry = (bottom - top) / 2 + pad + 3;
      const start = -Math.PI * (0.6 + rand() * 0.3);
      const turns = 1.08 + rand() * 0.06;
      const steps = 48;
      const drift = j(0.05);
      const points: string[] = [];
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const a = start + t * turns * Math.PI * 2;
        // Spiral in slightly so the end overlaps the start instead of closing perfectly.
        const scale = 1 + drift - t * 0.06 + Math.sin(t * Math.PI * 3) * 0.015;
        points.push(`${f(cx + Math.cos(a) * rx * scale)} ${f(cy + Math.sin(a) * ry * scale)}`);
      }
      return [{ d: `M${points.join(" L")}`, h: bottom - top }];
    }
  }
}

/**
 * A marker-style annotation that draws itself around inline text when it
 * scrolls into view: highlight, underline, circle, strike-through or box,
 * with a slightly hand-drawn wobble and as many pen passes as you like.
 *
 * The strokes are SVG paths measured from the text's own line boxes, so
 * highlights and underlines follow the text across line breaks and redraw on
 * resize. Several highlighters that appear together draw one after another.
 * The text stays ordinary, selectable markup; the drawing is decorative,
 * comes from a seeded generator (no hydration mismatch) and appears instantly
 * under reduced motion.
 */
export function Highlighter({
  children,
  as = "span",
  action = "highlight",
  color,
  strokeWidth = 2,
  iterations,
  duration = 0.9,
  delay = 0,
  padding = 3,
  sequence = true,
  seed,
  className,
  ...props
}: HighlighterProps) {
  const Comp = as as React.ElementType;
  const rootRef = React.useRef<HTMLElement>(null);
  const anchorRef = React.useRef<HTMLSpanElement>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const status = React.useRef<"idle" | "drawing" | "done">("idle");
  const controls = React.useRef<AnimationPlaybackControls[]>([]);
  const reduceMotion = useReducedMotion();
  const inView = useInView(rootRef, { once: true, amount: 0.6 });

  const passes = Math.max(1, Math.round(iterations ?? (action === "highlight" ? 1 : 2)));
  const stroke =
    color ?? (action === "highlight" ? "color-mix(in oklab, var(--color-primary) 28%, transparent)" : "var(--color-primary)");

  /** Rebuilds the paths from the current layout. Returns them in drawing order. */
  const draw = React.useCallback(
    (visible: boolean): SVGPathElement[] => {
      const root = rootRef.current;
      const anchor = anchorRef.current;
      const svg = svgRef.current;
      if (!root || !anchor || !svg) return [];
      const boxes = lineBoxes(root, anchor.getBoundingClientRect());
      const rand = mulberry32(seed ?? hash(`${action}:${root.textContent ?? ""}`));
      const paths: SVGPathElement[] = [];
      svg.replaceChildren();
      for (let pass = 0; pass < passes; pass++) {
        for (const { d, h } of shapes(action, boxes, padding, rand)) {
          const path = document.createElementNS(SVG_NS, "path");
          // A highlight is a marker stroke as tall as the line; the rest use strokeWidth.
          const thickness = action === "highlight" ? h * 0.82 : strokeWidth;
          path.setAttribute("d", d);
          path.setAttribute("fill", "none");
          path.setAttribute("pathLength", "1");
          path.setAttribute("stroke-dasharray", DASH);
          path.setAttribute("stroke-dashoffset", visible ? "0" : String(HIDDEN_OFFSET));
          path.setAttribute("stroke-width", String(thickness));
          path.setAttribute("stroke-linecap", action === "highlight" ? "butt" : "round");
          path.setAttribute("stroke-linejoin", "round");
          path.style.stroke = stroke;
          svg.appendChild(path);
          paths.push(path);
        }
      }
      return paths;
    },
    [action, passes, padding, strokeWidth, stroke, seed]
  );

  const stop = React.useCallback(() => {
    controls.current.forEach((c) => c.stop());
    controls.current = [];
  }, []);

  // Measure on mount and whenever the layout may have rewrapped the text.
  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const redraw = () => {
      if (status.current === "drawing") {
        stop();
        status.current = "done";
      }
      draw(status.current === "done");
    };
    redraw();
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(redraw);
    };
    // Inline elements don't report resizes, so watch the block that wraps the text.
    const observer = new ResizeObserver(schedule);
    observer.observe(root.parentElement ?? root);
    window.addEventListener("resize", schedule);
    document.fonts?.ready.then(schedule).catch(() => {});
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, [draw, stop, children]);

  React.useEffect(() => {
    if (reduceMotion) {
      stop();
      status.current = "done";
      draw(true);
      return;
    }
    if (!inView || status.current !== "idle") return;
    const total = Math.max(0.05, duration) * 1000;
    const turn = sequence ? reserveTurn(delay * 1000 + total) : null;
    let started = false;

    const timer = window.setTimeout(() => {
      started = true;
      status.current = "drawing";
      const paths = draw(false);
      const lengths = paths.map((p) => Math.max(1, p.getTotalLength()));
      const sum = lengths.reduce((a, b) => a + b, 0);
      let at = 0;
      controls.current = paths.map((path, i) => {
        const slice = (Math.max(0.05, duration) * lengths[i]) / sum;
        const c = animate(HIDDEN_OFFSET, 0, {
          duration: slice,
          delay: at,
          ease: [0.45, 0.05, 0.3, 1],
          onUpdate: (v) => path.setAttribute("stroke-dashoffset", String(v)),
        });
        at += slice;
        return c;
      });
      Promise.all(controls.current.map((c) => c.finished)).then(
        () => {
          if (status.current === "drawing") status.current = "done";
        },
        () => {}
      );
    }, (turn?.wait ?? 0) + delay * 1000);

    return () => {
      window.clearTimeout(timer);
      if (!started) turn?.release();
      if (status.current === "drawing") {
        stop();
        status.current = "idle";
      }
    };
  }, [inView, reduceMotion, duration, delay, sequence, draw, stop]);

  const onTop = action === "strike-through";

  return (
    <Comp
      ref={rootRef}
      data-slot="highlighter"
      data-action={action}
      className={cn("relative isolate bg-transparent text-inherit", className)}
      {...props}
    >
      {/* Zero-size anchor: paths are drawn relative to wherever the browser places it. */}
      <span
        ref={anchorRef}
        aria-hidden
        className={cn("pointer-events-none absolute top-0 left-0 size-0 select-none", onTop ? "z-[1]" : "-z-10")}
      >
        <svg ref={svgRef} width="1" height="1" className="absolute top-0 left-0 overflow-visible" focusable="false" />
      </span>
      {children}
    </Comp>
  );
}
