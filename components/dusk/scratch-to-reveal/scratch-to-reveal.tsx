"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

export interface ScratchToRevealProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** The prize: rendered underneath the foil and announced once revealed. */
  children: React.ReactNode;
  /** Brush radius in CSS px. */
  brushSize?: number;
  /** Percentage of the foil (0–100) that must be scratched off before the rest falls away. */
  minScratchPercentage?: number;
  /** Called once, when the card is fully revealed (by scratching or by the button). */
  onComplete?: () => void;
  /** Two or more CSS colors for the foil gradient, drawn diagonally. */
  gradientColors?: string[];
  /** Overlay a fine hatch and glints on the foil. */
  pattern?: boolean;
  /** Hint drawn over the foil until scratching starts. `null` hides it. */
  hint?: React.ReactNode;
  /** Text for the reveal button used by keyboard and screen reader users. */
  revealLabel?: string;
  /** Keep the reveal button visible. By default it appears when it receives keyboard focus. */
  showRevealButton?: boolean;
}

const DEFAULT_COLORS = ["#0f2a22", "#1f6f57", "#5eead4", "#1f6f57", "#0b1f19"];

type Point = [number, number];

type Surface = { ctx: CanvasRenderingContext2D | null; width: number; height: number };

/** Erases a stroke (relative points) from index `from` on. */
function eraseStroke({ ctx, width, height }: Surface, stroke: Point[], from: number, radius: number) {
  if (!ctx || !stroke.length) return;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = radius * 2;
  ctx.fillStyle = "#000";
  ctx.strokeStyle = "#000";
  if (from === 0) {
    const [x, y] = stroke[0];
    ctx.beginPath();
    ctx.arc(x * width, y * height, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  if (stroke.length < 2) return;
  ctx.beginPath();
  const start = Math.max(0, from - 1);
  ctx.moveTo(stroke[start][0] * width, stroke[start][1] * height);
  for (let i = start + 1; i < stroke.length; i++) {
    ctx.lineTo(stroke[i][0] * width, stroke[i][1] * height);
  }
  ctx.stroke();
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

/** Resolves any CSS color (variables, oklch…) to something canvas understands. */
function resolveColor(host: HTMLElement, color: string) {
  const probe = document.createElement("span");
  probe.style.color = color;
  probe.style.display = "none";
  host.appendChild(probe);
  const value = getComputedStyle(probe).color;
  probe.remove();
  return value || color;
}

/**
 * A scratch card: a canvas foil over any content that the visitor scratches
 * away with a mouse, pen or finger. Once `minScratchPercentage` of the foil is
 * gone, the rest dissolves and `onComplete` fires.
 *
 * The foil is sharp on high-DPI screens and survives resizes (strokes are kept
 * in relative coordinates and replayed). A CSS copy of the gradient covers the
 * prize in the server HTML until the canvas paints, so it never flashes.
 * The hidden content is `inert` until revealed; keyboard and screen reader users
 * get a real "Reveal" button that does the same thing and moves focus to the
 * prize. The reveal animation is instant under reduced motion.
 */
export function ScratchToReveal({
  children,
  brushSize = 22,
  minScratchPercentage = 50,
  onComplete,
  gradientColors = DEFAULT_COLORS,
  pattern = true,
  hint = (
    <>
      <Sparkles className="size-4" aria-hidden />
      Scratch to reveal
    </>
  ),
  revealLabel = "Reveal",
  showRevealButton = false,
  className,
  "aria-label": ariaLabel = "Scratch card",
  ...props
}: ScratchToRevealProps) {
  const reduceMotion = useReducedMotion();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const coverRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [started, setStarted] = React.useState(false);
  const [revealed, setRevealed] = React.useState(false);

  // Mutable drawing state that never needs a render.
  const drawing = React.useRef({
    ctx: null as CanvasRenderingContext2D | null,
    width: 0,
    height: 0,
    strokes: [] as Point[][],
    active: null as Point[] | null,
    pointerId: -1,
    lastCheck: 0,
    done: false,
  });

  const onCompleteRef = React.useRef(onComplete);
  React.useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const finish = React.useCallback((viaButton: boolean) => {
    const d = drawing.current;
    if (d.done) return;
    d.done = true;
    d.active = null;
    setRevealed(true);
    onCompleteRef.current?.();
    // The button is about to disappear; give focus somewhere meaningful.
    if (viaButton) requestAnimationFrame(() => contentRef.current?.focus());
  }, []);

  const colorsKey = gradientColors.join("|");

  // Canvas lifecycle: size to the container (DPR aware), paint the foil, replay strokes.
  React.useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!root || !canvas || !ctx) return;
    const d = drawing.current;
    d.ctx = ctx;
    const colors = colorsKey.split("|").map((c) => resolveColor(root, c));

    const paintFoil = () => {
      const { width: w, height: h } = d;
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      colors.forEach((c, i) => gradient.addColorStop(colors.length > 1 ? i / (colors.length - 1) : 0, c));
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      if (pattern) {
        // Fine diagonal hatch.
        ctx.save();
        ctx.globalAlpha = 0.07;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = -h; i < w; i += 6) {
          ctx.moveTo(i, h);
          ctx.lineTo(i + h, 0);
        }
        ctx.stroke();
        ctx.restore();
        // Glints, seeded so every render scatters them the same way.
        const rand = mulberry32(7);
        const count = Math.round((w * h) / 900);
        ctx.fillStyle = "#ffffff";
        for (let i = 0; i < count; i++) {
          ctx.globalAlpha = 0.08 + rand() * 0.35;
          ctx.beginPath();
          ctx.arc(rand() * w, rand() * h, 0.4 + rand() * 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      ctx.globalCompositeOperation = "destination-out";
    };

    const replay = () => {
      for (const stroke of d.strokes) eraseStroke(d, stroke, 0, brushSize);
    };

    const resize = () => {
      const rect = root.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      d.width = Math.max(1, rect.width);
      d.height = Math.max(1, rect.height);
      canvas.width = Math.round(d.width * dpr);
      canvas.height = Math.round(d.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintFoil();
      replay();
      // The canvas now covers the prize; drop the server-rendered stand-in.
      if (coverRef.current) coverRef.current.style.visibility = "hidden";
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(root);
    return () => {
      observer.disconnect();
      d.ctx = null;
    };
  }, [colorsKey, pattern, brushSize]);

  /** Share of the foil that is gone, sampled on a coarse grid of device pixels. */
  function scratchedRatio() {
    const canvas = canvasRef.current;
    const { ctx } = drawing.current;
    if (!canvas || !ctx) return 0;
    const { width, height } = canvas;
    const data = ctx.getImageData(0, 0, width, height).data;
    const step = Math.max(2, Math.round(Math.sqrt((width * height) / 12000)));
    let clear = 0;
    let total = 0;
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        total++;
        if (data[(y * width + x) * 4 + 3] < 128) clear++;
      }
    }
    return total ? clear / total : 0;
  }

  function check(force: boolean) {
    const d = drawing.current;
    const now = performance.now();
    if (!force && now - d.lastCheck < 150) return;
    d.lastCheck = now;
    if (scratchedRatio() * 100 >= minScratchPercentage) finish(false);
  }

  function relativePoint(event: { clientX: number; clientY: number }): Point {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || !rect.width || !rect.height) return [0, 0];
    return [(event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height];
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const d = drawing.current;
    if (d.done || (event.pointerType === "mouse" && event.button !== 0)) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    d.pointerId = event.pointerId;
    d.active = [relativePoint(event)];
    d.strokes.push(d.active);
    eraseStroke(d, d.active, 0, brushSize);
    if (!started) setStarted(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const d = drawing.current;
    if (!d.active || event.pointerId !== d.pointerId) return;
    const events = event.nativeEvent.getCoalescedEvents?.() ?? [];
    const from = d.active.length;
    for (const e of events.length ? events : [event]) d.active.push(relativePoint(e));
    eraseStroke(d, d.active, from, brushSize);
    check(false);
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const d = drawing.current;
    if (event.pointerId !== d.pointerId) return;
    d.active = null;
    d.pointerId = -1;
    if (!d.done) check(true);
  };

  const foilGradient = `linear-gradient(to bottom right, ${gradientColors.join(", ")})`;
  const exit = reduceMotion
    ? { opacity: 0, transition: { duration: 0 } }
    : { opacity: 0, scale: 1.06, filter: "blur(6px)", transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label={ariaLabel}
      data-slot="scratch-to-reveal"
      data-state={revealed ? "revealed" : "covered"}
      className={cn("relative isolate overflow-hidden rounded-xl", className)}
      {...props}
    >
      <motion.div
        ref={contentRef}
        tabIndex={-1}
        inert={!revealed}
        className="size-full outline-none"
        initial={false}
        animate={revealed && !reduceMotion ? { scale: [0.96, 1.02, 1] } : { scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {children}
      </motion.div>

      <AnimatePresence>
        {!revealed && (
          <motion.div key="foil" aria-hidden className="absolute inset-0 z-10" exit={exit}>
            <div ref={coverRef} className="absolute inset-0" style={{ backgroundImage: foilGradient }} />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 block size-full cursor-crosshair touch-none select-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              onLostPointerCapture={handlePointerEnd}
            />
            {hint !== null && (
              <motion.div
                className="pointer-events-none absolute inset-0 grid place-items-center"
                initial={false}
                animate={{ opacity: started ? 0 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-xs font-medium tracking-wide text-white/85 backdrop-blur-sm">
                  {hint}
                </span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!revealed && (
        <button
          type="button"
          onClick={() => finish(true)}
          className={cn(
            "absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-[0_0_24px_-6px_var(--color-primary)] outline-none",
            "transition-opacity duration-200 focus-visible:ring-[3px] focus-visible:ring-ring/50 motion-reduce:transition-none",
            !showRevealButton && "pointer-events-none opacity-0 focus-visible:pointer-events-auto focus-visible:opacity-100"
          )}
        >
          {revealLabel}
        </button>
      )}
    </div>
  );
}
