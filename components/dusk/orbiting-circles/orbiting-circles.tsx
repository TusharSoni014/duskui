"use client";

import * as React from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
} from "motion/react";

import { cn } from "@/lib/utils";

export interface OrbitingCirclesProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** The items to orbit. They are spaced evenly around the ring. */
  children: React.ReactNode;
  /** Radius of the orbit in px. */
  radius?: number;
  /** Seconds for one full lap. */
  duration?: number;
  /** Orbit counter-clockwise. */
  reverse?: boolean;
  /** Where the first item sits, in degrees (0 = right, 90 = bottom). */
  startAngle?: number;
  /** Draw the orbit ring. */
  path?: boolean;
  /** Width and height of each item's slot in px. */
  iconSize?: number;
  /** Stop the ring while the pointer is over an item or an item has keyboard focus. */
  pauseOnHover?: boolean;
  /** Classes for the orbit ring. */
  pathClassName?: string;
  /** Classes for each item's slot. */
  itemClassName?: string;
}

function OrbitItem({
  rotation,
  angle,
  radius,
  size,
  className,
  children,
}: {
  rotation: MotionValue<number>;
  angle: number;
  radius: number;
  size: number;
  className?: string;
  children: React.ReactNode;
}) {
  // Translating (instead of rotating the whole ring) keeps every item upright.
  const x = useTransform(rotation, (r) => Math.round(radius * Math.cos(((r + angle) * Math.PI) / 180) * 100) / 100);
  const y = useTransform(rotation, (r) => Math.round(radius * Math.sin(((r + angle) * Math.PI) / 180) * 100) / 100);
  return (
    <motion.div
      data-slot="orbiting-circles-item"
      className={cn(
        "pointer-events-auto absolute left-1/2 top-1/2 flex items-center justify-center",
        className
      )}
      style={{ x, y, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Items travelling around a shared centre on a circular orbit. Stack several
 * `OrbitingCircles` in one positioned container for multiple rings; each one
 * fills that container and centres itself.
 *
 * One motion value drives every item, so React never re-renders while it
 * spins. It pauses off-screen and in hidden tabs, optionally on hover and
 * focus, and under reduced motion the items rest, evenly spaced.
 */
export function OrbitingCircles({
  children,
  radius = 120,
  duration = 20,
  reverse = false,
  startAngle = -90,
  path = true,
  iconSize = 40,
  pauseOnHover = false,
  pathClassName,
  itemClassName,
  className,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: OrbitingCirclesProps) {
  const reduceMotion = useReducedMotion();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const rotation = useMotionValue(0);
  const controls = React.useRef<AnimationPlaybackControls | null>(null);
  const state = React.useRef({ onScreen: true, hovered: false, focused: false });

  const items = React.Children.toArray(children);
  const step = items.length ? 360 / items.length : 0;

  const sync = React.useCallback(() => {
    const c = controls.current;
    if (!c) return;
    const s = state.current;
    const paused = !s.onScreen || document.hidden || (pauseOnHover && (s.hovered || s.focused));
    if (paused) c.pause();
    else c.play();
  }, [pauseOnHover]);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || reduceMotion) {
      rotation.set(0);
      return;
    }
    const from = rotation.get() % 360;
    const c = animate(rotation, [from, from + (reverse ? -360 : 360)], {
      duration: Math.max(0.1, duration),
      ease: "linear",
      repeat: Infinity,
    });
    controls.current = c;
    sync();

    const observer = new IntersectionObserver(([entry]) => {
      state.current.onScreen = entry.isIntersecting;
      sync();
    });
    observer.observe(root);
    document.addEventListener("visibilitychange", sync);
    return () => {
      c.stop();
      controls.current = null;
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [rotation, duration, reverse, reduceMotion, sync]);

  return (
    <div
      ref={rootRef}
      data-slot="orbiting-circles"
      className={cn("pointer-events-none absolute inset-0 flex items-center justify-center", className)}
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        state.current.hovered = true;
        sync();
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        state.current.hovered = false;
        sync();
      }}
      onFocus={(e) => {
        onFocus?.(e);
        state.current.focused = true;
        sync();
      }}
      onBlur={(e) => {
        onBlur?.(e);
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          state.current.focused = false;
          sync();
        }
      }}
      {...props}
    >
      {path && (
        <div
          aria-hidden
          className={cn("absolute rounded-full border border-white/10", pathClassName)}
          style={{ width: radius * 2, height: radius * 2 }}
        />
      )}
      <div className="relative size-0">
        {items.map((child, i) => (
          <OrbitItem
            key={React.isValidElement(child) && child.key != null ? child.key : i}
            rotation={rotation}
            angle={startAngle + step * i}
            radius={radius}
            size={iconSize}
            className={itemClassName}
          >
            {child}
          </OrbitItem>
        ))}
      </div>
    </div>
  );
}
