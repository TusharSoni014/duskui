"use client";

import * as React from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
} from "motion/react";
import { ChevronsLeftRight, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

const glide = { type: "spring", stiffness: 380, damping: 36 } as const;

const clamp = (value: number) => Math.min(100, Math.max(0, value));

export interface ImageCompareProps
  extends Omit<React.ComponentProps<"div">, "children" | "defaultValue" | "onChange"> {
  /** Layer revealed on the left (or top). Any element: an <img>, a component, a canvas… It is stretched to fill. */
  before: React.ReactNode;
  /** Layer revealed on the right (or bottom). */
  after: React.ReactNode;
  /** Small badge in the corner of the before layer. A string also names the layer for screen readers. */
  beforeLabel?: React.ReactNode;
  /** Small badge in the corner of the after layer. */
  afterLabel?: React.ReactNode;
  /** Direction the divider travels. */
  orientation?: "horizontal" | "vertical";
  /** Controlled divider position in percent (0 = all after, 100 = all before). */
  position?: number;
  /** Starting position when uncontrolled. */
  defaultPosition?: number;
  /** Called with the new position (0–100) while dragging, hovering or using the keyboard. */
  onPositionChange?: (position: number) => void;
  /** `drag` follows a press-and-drag; `hover` follows the mouse without pressing (touch still drags). */
  mode?: "drag" | "hover";
  /** Percent moved per arrow key press. Page Up / Page Down move 10. */
  step?: number;
  /** Accessible name of the slider. */
  label?: string;
}

/**
 * A before/after comparison slider that reveals one layer over another with a clip-path as you drag the divider, hover, or use the keyboard.
 */
export function ImageCompare({
  before,
  after,
  beforeLabel,
  afterLabel,
  orientation = "horizontal",
  position: positionProp,
  defaultPosition = 50,
  onPositionChange,
  mode = "drag",
  step = 2,
  label = "Comparison slider",
  className,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  ...props
}: ImageCompareProps) {
  const horizontal = orientation === "horizontal";
  const reduceMotion = useReducedMotion();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const knobRef = React.useRef<HTMLDivElement>(null);
  const dragging = React.useRef(false);
  const animation = React.useRef<AnimationPlaybackControls | null>(null);
  const [initial] = React.useState(() => clamp(positionProp ?? defaultPosition));

  // The divider lives in a motion value so dragging never re-renders React.
  const pos = useMotionValue(initial);
  const clipPath = useTransform(pos, (v) =>
    horizontal ? `inset(0 ${100 - v}% 0 0)` : `inset(0 0 ${100 - v}% 0)`
  );
  const offset = useMotionTemplate`${pos}%`;

  const beforeName = typeof beforeLabel === "string" ? beforeLabel : "before";
  const afterName = typeof afterLabel === "string" ? afterLabel : "after";
  const valueText = (v: number) => {
    const rounded = Math.round(v);
    return `${rounded}% ${beforeName}, ${100 - rounded}% ${afterName}`;
  };

  // Keep the slider's aria values in sync without a render per frame.
  useMotionValueEvent(pos, "change", (v) => {
    const knob = knobRef.current;
    if (!knob) return;
    knob.setAttribute("aria-valuenow", String(Math.round(v)));
    knob.setAttribute("aria-valuetext", valueText(v));
  });

  // Follow the controlled prop.
  React.useEffect(() => {
    if (positionProp === undefined) return;
    const next = clamp(positionProp);
    if (Math.abs(next - pos.get()) < 0.01) return;
    animation.current?.stop();
    if (reduceMotion || dragging.current) pos.set(next);
    else animation.current = animate(pos, next, glide);
  }, [positionProp, pos, reduceMotion]);

  React.useEffect(() => () => animation.current?.stop(), []);

  const moveTo = (value: number, animated: boolean) => {
    const next = clamp(value);
    animation.current?.stop();
    if (animated && !reduceMotion) animation.current = animate(pos, next, glide);
    else pos.set(next);
    onPositionChange?.(next);
  };

  const fromPointer = (event: React.PointerEvent) => {
    const rect = rootRef.current!.getBoundingClientRect();
    const ratio = horizontal
      ? (event.clientX - rect.left) / rect.width
      : (event.clientY - rect.top) / rect.height;
    return ratio * 100;
  };

  const setDragging = (value: boolean) => {
    dragging.current = value;
    const root = rootRef.current;
    if (!root) return;
    if (value) root.dataset.dragging = "";
    else delete root.dataset.dragging;
  };

  const hoverFollows = (event: React.PointerEvent) => mode === "hover" && event.pointerType === "mouse";

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const current = pos.get();
    // Arrows move the divider the way they point; Up/Down follow the WAI-ARIA slider rule horizontally.
    const forward = horizontal ? ["ArrowRight", "ArrowUp"] : ["ArrowRight", "ArrowDown"];
    const backward = horizontal ? ["ArrowLeft", "ArrowDown"] : ["ArrowLeft", "ArrowUp"];
    let next: number | null = null;
    if (forward.includes(event.key)) next = current + step;
    else if (backward.includes(event.key)) next = current - step;
    else if (event.key === (horizontal ? "PageUp" : "PageDown")) next = current + 10;
    else if (event.key === (horizontal ? "PageDown" : "PageUp")) next = current - 10;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 100;
    if (next === null) return;
    event.preventDefault();
    moveTo(next, event.key === "Home" || event.key === "End" || event.key.startsWith("Page"));
  };

  const badge =
    "pointer-events-none absolute z-10 rounded-full border border-white/10 bg-background/70 px-2.5 py-1 text-xs font-medium text-foreground/90 backdrop-blur-md";

  return (
    <div
      ref={rootRef}
      data-slot="image-compare"
      data-orientation={orientation}
      className={cn(
        "group/compare relative isolate aspect-[16/10] w-full overflow-hidden rounded-xl border bg-muted select-none",
        horizontal ? "cursor-ew-resize touch-pan-y" : "cursor-ns-resize touch-pan-x",
        className
      )}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (event.defaultPrevented || event.button !== 0 || hoverFollows(event)) return;
        // Stop native image dragging and text selection; focus the handle ourselves.
        event.preventDefault();
        knobRef.current?.focus({ preventScroll: true });
        event.currentTarget.setPointerCapture(event.pointerId);
        setDragging(true);
        moveTo(fromPointer(event), true);
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (dragging.current || hoverFollows(event)) moveTo(fromPointer(event), false);
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event);
        setDragging(false);
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event);
        setDragging(false);
      }}
      {...props}
    >
      <div className="absolute inset-0 *:size-full [&_img]:pointer-events-none [&_img]:object-cover">
        {after}
      </div>
      {afterLabel ? (
        <span className={cn(badge, horizontal ? "top-3 right-3" : "bottom-3 left-3")}>{afterLabel}</span>
      ) : null}

      <motion.div
        className="absolute inset-0 z-[1] [&_img]:pointer-events-none [&_img]:object-cover"
        style={{ clipPath, WebkitClipPath: clipPath }}
      >
        <div className="absolute inset-0 *:size-full">{before}</div>
        {beforeLabel ? <span className={cn(badge, "top-3 left-3")}>{beforeLabel}</span> : null}
      </motion.div>

      {/* Divider + handle. The root takes the pointer; the knob is only the keyboard target. */}
      <motion.div
        className={cn("pointer-events-none absolute z-20", horizontal ? "inset-y-0 w-0" : "inset-x-0 h-0")}
        style={horizontal ? { left: offset } : { top: offset }}
      >
        <span
          aria-hidden
          className={cn(
            "absolute bg-white/90",
            horizontal ? "inset-y-0 -left-px w-0.5" : "inset-x-0 -top-px h-0.5"
          )}
        />
        <div
          ref={knobRef}
          role="slider"
          tabIndex={0}
          aria-label={label}
          aria-orientation={orientation}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(positionProp ?? initial)}
          aria-valuetext={valueText(positionProp ?? initial)}
          onKeyDown={handleKeyDown}
          className={cn(
            "absolute grid size-9 place-items-center rounded-full border border-white/20 bg-background text-foreground shadow-md outline-none",
            "transition-colors duration-150 ease-out motion-reduce:transition-none",
            "group-data-[dragging]/compare:bg-accent",
            "focus-visible:ring-[3px] focus-visible:ring-ring/60",
            horizontal ? "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2" : "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
          )}
        >
          {horizontal ? (
            <ChevronsLeftRight aria-hidden className="size-4" />
          ) : (
            <ChevronsUpDown aria-hidden className="size-4" />
          )}
        </div>
      </motion.div>
    </div>
  );
}
