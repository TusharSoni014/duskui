"use client";

import * as React from "react";
import { animate, useReducedMotion, type AnimationPlaybackControls } from "motion/react";

import { cn } from "@/lib/utils";

export interface TechGridProps extends React.ComponentProps<"div"> {
  /** `flat` is a blueprint grid; `perspective` is a receding floor that scrolls toward you. */
  variant?: "flat" | "perspective";
  /** Any CSS color for the lines. Defaults to white, mixed down to a faint tint. */
  color?: string;
  /** Size of one grid cell in px. */
  cellSize?: number;
  /** Speed multiplier for the floor and the scan line. */
  speed?: number;
  /** Sweep a faint scan line across the grid. */
  scanLine?: boolean;
  /** Fade the grid out toward the edges. */
  fade?: boolean;
}

const mix = (color: string, amount: number) => `color-mix(in oklab, ${color} ${amount}%, transparent)`;
const lines = (color: string) =>
  `linear-gradient(to right, ${color} 1px, transparent 1px), linear-gradient(to bottom, ${color} 1px, transparent 1px)`;

/**
 * An animated tech grid background. The flat variant is a quiet blueprint
 * grid with a faint scan line sweeping down; the perspective variant is a
 * retro floor that scrolls toward the viewer. Fills its nearest positioned parent.
 *
 * The background never takes pointer events, so content on top stays fully
 * interactive. Animations pause off-screen and in hidden tabs, and stop for
 * reduced motion.
 */
export function TechGrid({
  variant = "flat",
  color = "rgb(255 255 255)",
  cellSize = 40,
  speed = 1,
  scanLine = true,
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

  React.useEffect(() => {
    const root = rootRef.current;
    if (reduceMotion || !root) return;
    const rate = Math.max(speed, 0.05);
    const controls: AnimationPlaybackControls[] = [];
    if (variant === "perspective" && floorRef.current) {
      controls.push(
        animate(floorRef.current, { y: [0, cell] }, { duration: 2 / rate, ease: "linear", repeat: Infinity })
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
            style={{ top: -cell, backgroundImage: lines(mix(color, 18)), backgroundSize: size }}
          />
          {showScan && (
            <div
              ref={scanRef}
              className="absolute inset-0"
              style={{
                transform: "translateY(-100%)",
                background: `linear-gradient(to bottom, transparent 90%, ${mix(color, 5)} 98.5%, ${mix(color, 25)} 99.8%, transparent)`,
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
      <div className="absolute inset-0" style={{ backgroundImage: lines(mix(color, 8)), backgroundSize: size }} />

      {showScan && (
        <div
          ref={scanRef}
          className="absolute inset-0"
          style={{
            transform: "translateY(-100%)",
            background: `linear-gradient(to bottom, transparent 70%, ${mix(color, 3)} 96%, ${mix(color, 20)} 99.6%, transparent)`,
          }}
        />
      )}
    </div>
  );
}
