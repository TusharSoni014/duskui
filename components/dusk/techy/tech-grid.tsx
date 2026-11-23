"use client";

import * as React from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type AnimationPlaybackControls,
} from "motion/react";

import { cn } from "@/lib/utils";

export interface TechGridProps extends React.ComponentProps<"div"> {
  /** `flat` is a blueprint grid with cursor-lit cells; `perspective` is a receding floor that scrolls toward you. */
  variant?: "flat" | "perspective";
  /** Any CSS color. Defaults to the theme primary. */
  color?: string;
  /** Size of one grid cell in px. */
  cellSize?: number;
  /** Speed multiplier for the floor and the scan line. */
  speed?: number;
  /** Sweep a glowing scan line across the grid. */
  scanLine?: boolean;
  /** Light up the cells around the cursor (flat variant, mouse only). */
  interactive?: boolean;
  /** Radius of the cursor light in px. */
  radius?: number;
  /** Fade the grid out toward the edges. */
  fade?: boolean;
}

const mix = (color: string, amount: number) => `color-mix(in oklab, ${color} ${amount}%, transparent)`;
const lines = (color: string) =>
  `linear-gradient(to right, ${color} 1px, transparent 1px), linear-gradient(to bottom, ${color} 1px, transparent 1px)`;

/**
 * An animated tech grid background. The flat variant lights up whole cells
 * around the cursor while a scan line sweeps down; the perspective variant is
 * a retro floor that scrolls toward the viewer. Fills its nearest positioned parent.
 *
 * The background never takes pointer events: the cursor is tracked on the
 * window with motion values, so content on top stays fully interactive.
 * Animations pause off-screen and in hidden tabs, and stop for reduced motion.
 */
export function TechGrid({
  variant = "flat",
  color = "var(--color-primary)",
  cellSize = 40,
  speed = 1,
  scanLine = true,
  interactive = true,
  radius = 160,
  fade = true,
  className,
  style,
  ...props
}: TechGridProps) {
  const reduceMotion = useReducedMotion();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const floorRef = React.useRef<HTMLDivElement>(null);
  const scanRef = React.useRef<HTMLDivElement>(null);
  const cell = Math.max(8, cellSize);
  const tracking = interactive && variant === "flat";

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const lit = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 260, damping: 28 });
  const sy = useSpring(my, { stiffness: 260, damping: 28 });
  const sLit = useSpring(lit, { stiffness: 200, damping: 30 });
  const spot = useMotionTemplate`radial-gradient(${radius}px circle at ${sx}px ${sy}px, #000, transparent)`;
  // Intersect the light with a per-cell inset so only whole cells glow.
  const cellMask = useMotionTemplate`${spot}, linear-gradient(to right, transparent 3px, #000 3px, #000 calc(100% - 2px), transparent calc(100% - 2px)), linear-gradient(to bottom, transparent 3px, #000 3px, #000 calc(100% - 2px), transparent calc(100% - 2px))`;

  React.useEffect(() => {
    const root = rootRef.current;
    if (!tracking || !root) return;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = root.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        lit.set(0);
        return;
      }
      // Snap to the hovered cell's center so the light steps from cell to cell.
      const cx = Math.floor(x / cell) * cell + cell / 2;
      const cy = Math.floor(y / cell) * cell + cell / 2;
      if (lit.get() === 0) {
        sx.jump(cx);
        sy.jump(cy);
      }
      mx.set(cx);
      my.set(cy);
      lit.set(1);
    };
    const onLeave = () => lit.set(0);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [tracking, cell, mx, my, sx, sy, lit]);

  React.useEffect(() => {
    const root = rootRef.current;
    if (reduceMotion || !root) return;
    const rate = Math.max(speed, 0.05);
    const controls: AnimationPlaybackControls[] = [];
    if (variant === "perspective" && floorRef.current) {
      controls.push(
        animate(floorRef.current, { y: [0, cell] }, { duration: 1.1 / rate, ease: "linear", repeat: Infinity })
      );
    }
    if (scanLine && scanRef.current) {
      controls.push(
        animate(
          scanRef.current,
          { y: ["-100%", "4%"] },
          { duration: (variant === "perspective" ? 3.5 : 5) / rate, ease: "linear", repeat: Infinity, repeatDelay: 1.2 / rate }
        )
      );
    }

    let inView = true;
    const sync = () => {
      const play = inView && !document.hidden;
      for (const c of controls) {
        if (play) c.play();
        else c.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(root);
    document.addEventListener("visibilitychange", sync);
    return () => {
      for (const c of controls) c.stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [variant, cell, speed, scanLine, reduceMotion]);

  const size = `${cell}px ${cell}px`;
  const showScan = scanLine && !reduceMotion;

  if (variant === "perspective") {
    return (
      <div
        ref={rootRef}
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 overflow-hidden [container-type:size]", className)}
        style={style}
        {...props}
      >
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(60% 35% at 50% 52%, ${mix(color, 16)}, transparent 70%)` }}
        />
        {/* Sizes in container units keep the horizon at the same height whatever the box size. */}
        <div
          className="absolute inset-x-[-200%] bottom-0 h-[500cqh] origin-bottom overflow-hidden"
          style={{
            transform: "perspective(120cqh) rotateX(62deg)",
            maskImage: "linear-gradient(to top, #000 0%, #000 20%, transparent 80%)",
          }}
        >
          <div
            ref={floorRef}
            className="absolute inset-x-0 bottom-0"
            style={{ top: -cell, backgroundImage: lines(mix(color, 45)), backgroundSize: size }}
          />
          {showScan && (
            <div
              ref={scanRef}
              className="absolute inset-0"
              style={{
                transform: "translateY(-100%)",
                background: `linear-gradient(to bottom, transparent 90%, ${mix(color, 14)} 98.5%, ${mix(color, 70)} 99.8%, transparent)`,
              }}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        fade && "[mask-image:radial-gradient(ellipse_at_center,#000_40%,transparent_85%)]",
        className
      )}
      style={style}
      {...props}
    >
      <div className="absolute inset-0" style={{ backgroundImage: lines(mix(color, 13)), backgroundSize: size }} />

      {tracking && (
        <>
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: lines(mix(color, 70)),
              backgroundSize: size,
              maskImage: spot,
              opacity: sLit,
            }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundColor: mix(color, 22),
              maskImage: cellMask,
              maskSize: `100% 100%, ${size}, ${size}`,
              maskComposite: "intersect",
              opacity: sLit,
            }}
          />
        </>
      )}

      {showScan && (
        <div
          ref={scanRef}
          className="absolute inset-0"
          style={{
            transform: "translateY(-100%)",
            background: `linear-gradient(to bottom, transparent 70%, ${mix(color, 8)} 96%, ${mix(color, 60)} 99.6%, transparent)`,
          }}
        />
      )}
    </div>
  );
}
