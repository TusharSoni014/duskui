"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export interface DataStreamProps extends React.ComponentProps<"div"> {
  /** Any CSS color, including CSS variables. Defaults to the theme primary. */
  color?: string;
  /** Number of horizontal lanes. */
  lanes?: number;
  /** Speed multiplier. */
  speed?: number;
  /** How busy each lane is, from 0 to 1. */
  density?: number;
  /** Which way the data flows. */
  direction?: "left" | "right";
  /** Fade the stream out at both ends. */
  fade?: boolean;
}

type Packet = { x: number; w: number; h: number; alpha: number; speed: number; kind: "stream" | "block" };
type Lane = { y: number; speed: number; packets: Packet[]; nextIn: number };

/** Resolves any CSS color (variables, oklch…) to sRGB by painting one pixel. */
function resolveColor(host: HTMLElement, color: string): [number, number, number] {
  const probe = document.createElement("span");
  probe.style.color = color;
  probe.style.display = "none";
  host.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();
  const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!ctx) return [255, 255, 255];
  ctx.fillStyle = computed;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
}

/**
 * Packets streaming along horizontal lanes at different speeds: thin fading
 * tails, short data blocks and faint lane rails. Drawn on a
 * <canvas> that fills its nearest positioned parent; a good hero accent.
 *
 * The loop pauses while off-screen or in a hidden tab, and reduced motion
 * draws a single still frame.
 */
export function DataStream({
  color = "var(--color-primary)",
  lanes = 10,
  speed = 1,
  density = 0.35,
  direction = "right",
  fade = true,
  className,
  ...props
}: DataStreamProps) {
  const reduceMotion = useReducedMotion();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!root || !canvas || !ctx) return;

    const [r, g, b] = resolveColor(root, color);
    const rgb = `${r}, ${g}, ${b}`;
    const busy = Math.min(Math.max(density, 0.02), 1);
    const laneCount = Math.max(1, Math.round(lanes));
    const mul = Math.max(speed, 0.05);

    // Pre-rendered sprite, stretched per packet: a tail that brightens toward its head.
    const tail = document.createElement("canvas");
    tail.width = 256;
    tail.height = 4;
    const tctx = tail.getContext("2d");
    if (tctx) {
      const grad = tctx.createLinearGradient(0, 0, 256, 0);
      grad.addColorStop(0, `rgba(${rgb}, 0)`);
      grad.addColorStop(0.75, `rgba(${rgb}, 0.4)`);
      grad.addColorStop(1, `rgba(${rgb}, 0.9)`);
      tctx.fillStyle = grad;
      tctx.fillRect(0, 0, 256, 4);
    }

    let width = 0;
    let height = 0;
    let dpr = 1;
    let laneList: Lane[] = [];

    const makePacket = (lane: Lane, x?: number): Packet => {
      const block = Math.random() < 0.3;
      const w = block ? 3 + Math.random() * 10 : 24 + Math.random() * Math.min(220, width * 0.3);
      return {
        x: x ?? 0,
        w,
        h: block ? 2 + Math.random() * 2 : 1 + Math.random() * 1.5,
        alpha: 0.2 + Math.random() * 0.4,
        speed: lane.speed * (block ? 0.7 : 0.85 + Math.random() * 0.4),
        kind: block ? "block" : "stream",
      };
    };
    const spawnDelay = () => (0.25 + Math.random() * 2.2) / (busy * 2 * mul);

    const layout = () => {
      const gap = height / laneCount;
      const next: Lane[] = [];
      for (let i = 0; i < laneCount; i++) {
        const existing = laneList[i];
        const lane: Lane = existing ?? {
          y: 0,
          speed: (50 + Math.random() * 230) * mul,
          packets: [],
          nextIn: 0,
        };
        lane.y = Math.round((i + 0.5) * gap) + 0.5;
        if (!existing) {
          // Pre-fill the lane so the first frame isn't empty.
          let x = width;
          while (x > 0) {
            x -= lane.speed * spawnDelay();
            if (x > -50) lane.packets.push(makePacket(lane, x));
          }
          lane.nextIn = spawnDelay();
        }
        next.push(lane);
      }
      laneList = next;
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      if (direction === "left") ctx.setTransform(-dpr, 0, 0, dpr, width * dpr, 0);

      ctx.fillStyle = `rgba(${rgb}, 0.05)`;
      for (const lane of laneList) ctx.fillRect(0, lane.y - 0.5, width, 1);

      for (const lane of laneList) {
        for (const p of lane.packets) {
          ctx.globalAlpha = p.alpha;
          if (p.kind === "block") {
            ctx.fillStyle = `rgb(${rgb})`;
            ctx.fillRect(p.x - p.w, lane.y - p.h / 2, p.w, p.h);
          } else {
            ctx.drawImage(tail, p.x - p.w, lane.y - p.h / 2, p.w, p.h);
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const step = (dt: number) => {
      for (const lane of laneList) {
        for (const p of lane.packets) p.x += p.speed * dt;
        lane.packets = lane.packets.filter((p) => p.x - p.w < width + 20);
        lane.nextIn -= dt;
        if (lane.nextIn <= 0) {
          lane.packets.push(makePacket(lane));
          lane.nextIn = spawnDelay();
        }
      }
    };

    const resize = () => {
      const rect = root.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      layout();
      draw();
    };

    let raf = 0;
    let last = 0;
    let inView = false;

    const loop = (time: number) => {
      const dt = last ? Math.min((time - last) / 1000, 0.1) : 0;
      last = time;
      if (Math.min(window.devicePixelRatio || 1, 2) !== dpr) resize();
      step(dt);
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (raf || reduceMotion || !inView || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(root);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    intersectionObserver.observe(root);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [color, lanes, speed, density, direction, reduceMotion]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        fade && "[mask-image:linear-gradient(to_right,transparent,#000_15%,#000_85%,transparent)]",
        className
      )}
      {...props}
    >
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  );
}
