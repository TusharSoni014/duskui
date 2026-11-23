"use client";

import * as React from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export interface LensProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The content to magnify: an image, an SVG, a block of text… */
  children: React.ReactNode;
  /** Magnification inside the lens. */
  zoom?: number;
  /** Diameter of the lens in px. */
  size?: number;
  /** Optional sharper content for the lens (e.g. a high-resolution image), laid out exactly like `children`. */
  lensContent?: React.ReactNode;
  /** Pixels the lens moves per arrow-key press (×4 with Shift). */
  keyboardStep?: number;
  /** Milliseconds a finger must rest before the lens appears on touch screens. */
  holdDelay?: number;
  /** Classes for the lens ring. */
  lensClassName?: string;
}

/**
 * A round magnifier that follows the cursor over any content. Inside the lens
 * a second, `inert` copy of the content is scaled around the pointer and
 * clipped to a circle, all through motion values, so moving it never
 * re-renders React.
 *
 * Mouse and pen show it on hover. On touch, press and hold to bring it up,
 * then drag; the page doesn't scroll while it is open. With the keyboard,
 * focus the area to show it in the centre, move it with the arrow keys and
 * hide it with Escape.
 */
export function Lens({
  children,
  zoom = 2,
  size = 170,
  lensContent,
  keyboardStep = 16,
  holdDelay = 220,
  lensClassName,
  className,
  onPointerMove,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  onFocus,
  onBlur,
  onKeyDown,
  onContextMenu,
  ...props
}: LensProps) {
  const reduceMotion = useReducedMotion();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(false);
  const activeRef = React.useRef(false);
  const hold = React.useRef<{ timer: number; x: number; y: number; id: number } | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const r = size / 2;
  const scale = Math.max(1, zoom);
  const clipPath = useMotionTemplate`circle(${r}px at ${x}px ${y}px)`;
  const origin = useMotionTemplate`${x}px ${y}px`;
  const ringX = useMotionTemplate`calc(${x}px - 50%)`;
  const ringY = useMotionTemplate`calc(${y}px - 50%)`;

  const show = React.useCallback((on: boolean) => {
    activeRef.current = on;
    setActive(on);
  }, []);

  const moveTo = React.useCallback(
    (px: number, py: number) => {
      const el = rootRef.current;
      if (!el) return;
      x.set(Math.min(Math.max(px, 0), el.clientWidth));
      y.set(Math.min(Math.max(py, 0), el.clientHeight));
    },
    [x, y]
  );

  const fromEvent = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return [event.clientX - rect.left, event.clientY - rect.top] as const;
  };

  const cancelHold = () => {
    if (hold.current) window.clearTimeout(hold.current.timer);
    hold.current = null;
  };

  // Touch: once the lens is up, stop the page from scrolling under the finger.
  // React's touch listeners are passive, so this needs a native one.
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const block = (event: TouchEvent) => {
      if (activeRef.current) event.preventDefault();
    };
    el.addEventListener("touchmove", block, { passive: false });
    return () => {
      el.removeEventListener("touchmove", block);
      if (hold.current) window.clearTimeout(hold.current.timer);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      role="group"
      aria-roledescription="magnifier"
      aria-label={props["aria-label"] ?? "Magnifier. Use the arrow keys to move the lens, Escape to hide it."}
      data-slot="lens"
      data-active={active || undefined}
      className={cn(
        "relative isolate overflow-hidden rounded-xl outline-none [-webkit-touch-callout:none]",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50",
        active && "cursor-none select-none",
        className
      )}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        if (event.pointerType === "touch") return;
        moveTo(...fromEvent(event));
        show(true);
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        const [px, py] = fromEvent(event);
        if (event.pointerType !== "touch") {
          moveTo(px, py);
          if (!activeRef.current) show(true);
          return;
        }
        if (activeRef.current) moveTo(px, py);
        else if (hold.current && Math.hypot(px - hold.current.x, py - hold.current.y) > 10) cancelHold();
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        if (event.pointerType !== "touch") show(false);
      }}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (event.pointerType !== "touch") return;
        const [px, py] = fromEvent(event);
        cancelHold();
        hold.current = {
          x: px,
          y: py,
          id: event.pointerId,
          timer: window.setTimeout(() => {
            if (!hold.current) return;
            moveTo(hold.current.x, hold.current.y);
            show(true);
          }, holdDelay),
        };
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event);
        if (event.pointerType !== "touch") return;
        cancelHold();
        show(false);
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event);
        cancelHold();
        if (event.pointerType === "touch") show(false);
      }}
      onContextMenu={(event) => {
        onContextMenu?.(event);
        // Long-press on touch opens the context menu on Android; the lens owns that gesture.
        if (activeRef.current || hold.current) event.preventDefault();
      }}
      onFocus={(event) => {
        onFocus?.(event);
        if (event.target !== event.currentTarget || activeRef.current) return;
        // Only for keyboard focus; a mouse click already placed the lens.
        if (!event.currentTarget.matches(":focus-visible")) return;
        moveTo(event.currentTarget.clientWidth / 2, event.currentTarget.clientHeight / 2);
        show(true);
      }}
      onBlur={(event) => {
        onBlur?.(event);
        show(false);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        const stepPx = keyboardStep * (event.shiftKey ? 4 : 1);
        const moves: Record<string, [number, number]> = {
          ArrowLeft: [-stepPx, 0],
          ArrowRight: [stepPx, 0],
          ArrowUp: [0, -stepPx],
          ArrowDown: [0, stepPx],
        };
        const move = moves[event.key];
        if (move) {
          event.preventDefault();
          if (!activeRef.current) {
            moveTo(event.currentTarget.clientWidth / 2, event.currentTarget.clientHeight / 2);
            show(true);
            return;
          }
          moveTo(x.get() + move[0], y.get() + move[1]);
        } else if (event.key === "Escape" && activeRef.current) {
          event.preventDefault();
          show(false);
        } else if ((event.key === "Enter" || event.key === " ") && !activeRef.current) {
          event.preventDefault();
          moveTo(event.currentTarget.clientWidth / 2, event.currentTarget.clientHeight / 2);
          show(true);
        }
      }}
      {...props}
    >
      {children}

      <motion.div
        aria-hidden
        inert
        data-slot="lens-view"
        className="pointer-events-none absolute inset-0 z-10"
        style={{ clipPath, WebkitClipPath: clipPath }}
        initial={false}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.15 }}
      >
        <motion.div className="absolute inset-0" style={{ scale, transformOrigin: origin }}>
          {lensContent ?? children}
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden
        data-slot="lens-ring"
        className={cn(
          "pointer-events-none absolute left-0 top-0 z-20 rounded-full border border-white/30",
          "shadow-lg",
          lensClassName
        )}
        style={{ width: size, height: size, x: ringX, y: ringY }}
        initial={false}
        animate={{ opacity: active ? 1 : 0, scale: active || reduceMotion ? 1 : 0.96 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.18, ease: "easeOut" }}
      />
    </div>
  );
}
