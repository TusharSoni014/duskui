"use client";

import * as React from "react";

import { Button, type ButtonProps } from "@/components/ui/button";

export type ConfettiShape = "square" | "circle" | "star" | "ribbon";

export interface ConfettiOptions {
  /** Where the burst starts, as fractions of the viewport (0–1). Default: the middle, a little below centre. */
  origin?: { x?: number; y?: number };
  /** Direction of the burst in degrees: 90 is straight up, 0 is right, 180 is left. */
  angle?: number;
  /** How wide the burst fans out, in degrees. */
  spread?: number;
  /** Number of pieces in this burst. */
  particleCount?: number;
  /** Launch speed in px per frame (at 60 fps). */
  startVelocity?: number;
  /** Downward pull per frame. `0` floats, `2` drops fast. */
  gravity?: number;
  /** Air resistance: the share of velocity kept each frame (0–1). */
  decay?: number;
  /** Constant sideways push per frame, like wind. Negative blows left. */
  drift?: number;
  /** Lifetime of each piece in frames (at 60 fps). Pieces fade out over the last third. */
  ticks?: number;
  /** Any CSS colors, including theme variables. */
  colors?: string[];
  /** Shapes to pick from at random. */
  shapes?: ConfettiShape[];
  /** Size multiplier for every piece. */
  scalar?: number;
  /** z-index of the shared full-viewport canvas. */
  zIndex?: number;
  /** Skip the burst when the user prefers reduced motion. Leave this on unless the confetti is essential. */
  disableForReducedMotion?: boolean;
}

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  decay: number;
  gravity: number;
  drift: number;
  size: number;
  color: string;
  shape: ConfettiShape;
  rotation: number;
  spin: number;
  /** Phase of the 3D flip; its cosine squashes the piece vertically. */
  flip: number;
  flipSpeed: number;
  wobble: number;
  wobbleSpeed: number;
  age: number;
  life: number;
  burst: Burst;
};

type Burst = { alive: number; resolve: () => void };

const DEFAULT_COLORS = [
  "var(--color-primary)",
  "#22d3ee",
  "#a78bfa",
  "#f472b6",
  "#facc15",
  "#ffffff",
];

const DEFAULT_SHAPES: ConfettiShape[] = ["square", "circle", "ribbon"];

// One canvas and one animation loop are shared by every burst on the page.
let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let raf = 0;
let last = 0;
let viewW = 0;
let viewH = 0;
let pieces: Piece[] = [];
const colorCache = new Map<string, string>();

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Turns any CSS color (variables, oklch…) into something the canvas understands. Cached per color. */
function resolveColor(color: string): string {
  const cached = colorCache.get(color);
  if (cached) return cached;
  let resolved = color;
  if (color.includes("var(")) {
    const probe = document.createElement("span");
    probe.style.color = color;
    probe.style.display = "none";
    document.body.appendChild(probe);
    resolved = getComputedStyle(probe).color || "#ffffff";
    probe.remove();
  }
  colorCache.set(color, resolved);
  return resolved;
}

function resize() {
  if (!canvas || !ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  viewW = window.innerWidth;
  viewH = window.innerHeight;
  canvas.width = Math.round(viewW * dpr);
  canvas.height = Math.round(viewH * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function mount(zIndex: number) {
  if (canvas) {
    canvas.style.zIndex = String(zIndex);
    return true;
  }
  const el = document.createElement("canvas");
  const context = el.getContext("2d");
  if (!context) return false;
  el.setAttribute("aria-hidden", "true");
  el.dataset.slot = "confetti-canvas";
  Object.assign(el.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: String(zIndex),
  });
  document.body.appendChild(el);
  canvas = el;
  ctx = context;
  resize();
  window.addEventListener("resize", resize);
  return true;
}

function unmount() {
  cancelAnimationFrame(raf);
  raf = 0;
  last = 0;
  window.removeEventListener("resize", resize);
  canvas?.remove();
  canvas = null;
  ctx = null;
}

function drawStar(c: CanvasRenderingContext2D, r: number) {
  c.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.45;
    c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  c.closePath();
  c.fill();
}

function drawPiece(c: CanvasRenderingContext2D, p: Piece) {
  const fadeStart = p.life * 0.66;
  const alpha = p.age < fadeStart ? 1 : Math.max(0, 1 - (p.age - fadeStart) / (p.life - fadeStart));
  c.save();
  c.globalAlpha = alpha;
  c.fillStyle = p.color;
  c.translate(p.x + Math.cos(p.wobble) * p.size * 0.6, p.y);
  c.rotate(p.rotation);
  // A squash between -1 and 1 reads as the piece tumbling through the air.
  c.scale(1, Math.cos(p.flip));
  const s = p.size;
  switch (p.shape) {
    case "circle":
      c.beginPath();
      c.ellipse(0, 0, s * 0.5, s * 0.5, 0, 0, Math.PI * 2);
      c.fill();
      break;
    case "star":
      drawStar(c, s * 0.7);
      break;
    case "ribbon":
      c.fillRect(-s * 0.2, -s * 0.9, s * 0.4, s * 1.8);
      break;
    default:
      c.fillRect(-s * 0.5, -s * 0.5, s, s * 0.7);
  }
  c.restore();
}

function frame(now: number) {
  if (!ctx) return;
  // Physics is tuned per 60 fps frame; scale by elapsed time so 120 Hz screens don't run double speed.
  const dt = last ? Math.min((now - last) / (1000 / 60), 3) : 1;
  last = now;
  ctx.clearRect(0, 0, viewW, viewH);

  const next: Piece[] = [];
  for (const p of pieces) {
    p.age += dt;
    const drag = Math.pow(p.decay, dt);
    p.vx *= drag;
    p.vy = p.vy * drag + p.gravity * dt;
    p.x += (p.vx + p.drift) * dt;
    p.y += p.vy * dt;
    p.rotation += p.spin * dt;
    p.flip += p.flipSpeed * dt;
    p.wobble += p.wobbleSpeed * dt;

    if (p.age >= p.life || p.y > viewH + 40) {
      p.burst.alive -= 1;
      if (p.burst.alive === 0) p.burst.resolve();
      continue;
    }
    drawPiece(ctx, p);
    next.push(p);
  }
  pieces = next;

  if (pieces.length === 0) {
    unmount();
    return;
  }
  raf = requestAnimationFrame(frame);
}

/**
 * Fires a burst of confetti from a point on the screen. Safe to call as often
 * as you like: every burst shares one fixed, full-viewport canvas that is
 * created on demand and removed as soon as the last piece settles.
 *
 * Resolves when this burst has finished. Does nothing on the server, and
 * (by default) when the user prefers reduced motion.
 */
export function confetti(options: ConfettiOptions = {}): Promise<void> {
  const {
    origin,
    angle = 90,
    spread = 60,
    particleCount = 80,
    startVelocity = 22,
    gravity = 0.55,
    decay = 0.93,
    drift = 0,
    ticks = 200,
    colors = DEFAULT_COLORS,
    shapes = DEFAULT_SHAPES,
    scalar = 1,
    zIndex = 100,
    disableForReducedMotion = true,
  } = options;

  if (typeof window === "undefined") return Promise.resolve();
  if (disableForReducedMotion && prefersReducedMotion()) return Promise.resolve();
  const count = Math.max(0, Math.round(particleCount));
  if (count === 0 || !mount(zIndex)) return Promise.resolve();

  const palette = (colors.length ? colors : DEFAULT_COLORS).map(resolveColor);
  const shapeList = shapes.length ? shapes : DEFAULT_SHAPES;
  const ox = (origin?.x ?? 0.5) * viewW;
  const oy = (origin?.y ?? 0.6) * viewH;
  const base = (angle * Math.PI) / 180;
  const fan = (spread * Math.PI) / 180;

  return new Promise<void>((resolve) => {
    const burst: Burst = { alive: count, resolve };
    for (let i = 0; i < count; i++) {
      // Randomness only ever runs in event handlers, never during render.
      const dir = base + (Math.random() - 0.5) * fan;
      const speed = startVelocity * (0.55 + Math.random() * 0.45);
      pieces.push({
        x: ox,
        y: oy,
        vx: Math.cos(dir) * speed,
        vy: -Math.sin(dir) * speed,
        decay,
        gravity,
        drift,
        size: (6 + Math.random() * 5) * scalar,
        color: palette[Math.floor(Math.random() * palette.length)],
        shape: shapeList[Math.floor(Math.random() * shapeList.length)],
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.3,
        flip: Math.random() * Math.PI * 2,
        flipSpeed: 0.08 + Math.random() * 0.12,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.05 + Math.random() * 0.08,
        age: 0,
        life: ticks * (0.8 + Math.random() * 0.4),
        burst,
      });
    }
    if (!raf) raf = requestAnimationFrame(frame);
  });
}

/** Clears every piece on screen immediately and removes the canvas. */
confetti.reset = () => {
  for (const p of pieces) {
    p.burst.alive -= 1;
    if (p.burst.alive === 0) p.burst.resolve();
  }
  pieces = [];
  if (typeof window !== "undefined") unmount();
};

/** The centre of an element as a viewport-relative `origin` for `confetti()`. */
export function originFromElement(element: Element): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  return {
    x: (rect.left + rect.width / 2) / window.innerWidth,
    y: (rect.top + rect.height / 2) / window.innerHeight,
  };
}

export interface ConfettiButtonProps extends ButtonProps {
  /** Options for the burst. The origin defaults to the centre of the button. */
  options?: ConfettiOptions;
}

/**
 * A DuskUI Button that bursts confetti from itself when clicked. The click
 * handler still runs as normal; call `event.preventDefault()` in `onClick`
 * to skip the burst. No confetti under reduced motion.
 */
export function ConfettiButton({ options, onClick, loading, ...props }: ConfettiButtonProps) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || loading) return;
    confetti({ ...options, origin: options?.origin ?? originFromElement(event.currentTarget) });
  };

  return <Button loading={loading} onClick={handleClick} {...props} />;
}
