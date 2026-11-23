"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ChevronLeft, ChevronRight, Lock, Plus, RotateCw, Share } from "lucide-react";

import { cn } from "@/lib/utils";

const spring = { stiffness: 200, damping: 22, mass: 0.6 };

/** Pointer-driven 3D tilt on motion values: no React renders while it moves. */
function useTilt(maxTilt: number) {
  const reduceMotion = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), spring);
  const enabled = maxTilt > 0 && !reduceMotion;

  const handlers = enabled
    ? {
        onPointerMove: (event: React.PointerEvent<HTMLElement>) => {
          if (event.pointerType !== "mouse") return;
          const rect = event.currentTarget.getBoundingClientRect();
          px.set((event.clientX - rect.left) / rect.width);
          py.set((event.clientY - rect.top) / rect.height);
        },
        onPointerLeave: () => {
          px.set(0.5);
          py.set(0.5);
        },
      }
    : {};

  return { enabled, handlers, rotateX, rotateY };
}

function tiltAmount(tilt: boolean | number | undefined) {
  if (tilt === true) return 8;
  if (typeof tilt === "number") return Math.max(0, tilt);
  return 0;
}

type TiltStyle = { rotateX: MotionValue<number>; rotateY: MotionValue<number> };

interface MockupBaseProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** What appears on the screen: any element, a component or a screenshot. */
  children?: React.ReactNode;
  /** Convenience for a screenshot. Ignored when `children` are passed. */
  src?: string;
  /** Alt text for `src`. Describe the screenshot, or pass "" if it's decorative. */
  alt?: string;
  /** Tilt toward the cursor on hover (mouse only). `true` = 8°, or a max angle in degrees. */
  tilt?: boolean | number;
  /** Classes for the screen area. */
  screenClassName?: string;
}

function Screen({ children, src, alt }: Pick<MockupBaseProps, "children" | "src" | "alt">) {
  if (children !== undefined) return <>{children}</>;
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element -- framework-agnostic registry component
    return <img src={src} alt={alt ?? ""} className="block size-full object-cover object-top" draggable={false} />;
  }
  return null;
}

/** Outer wrapper: a sized container with perspective that receives pointer events. */
function Stage({
  tilt,
  className,
  style,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  tilt: ReturnType<typeof useTilt>;
  children: (style: TiltStyle | undefined) => React.ReactNode;
}) {
  return (
    <div
      className={cn("@container relative w-full", className)}
      style={{ perspective: tilt.enabled ? 1200 : undefined, ...style }}
      {...tilt.handlers}
      {...props}
    >
      {children(tilt.enabled ? { rotateX: tilt.rotateX, rotateY: tilt.rotateY } : undefined)}
    </div>
  );
}

export interface SafariMockupProps extends MockupBaseProps {
  /** Text in the address bar. */
  url?: string;
  /** Screen aspect ratio (width / height), e.g. `16 / 10`. */
  ratio?: number;
}

/**
 * A browser window drawn in CSS and inline SVG: traffic lights, navigation
 * buttons and an address bar. Wrap any content or a screenshot in it. The
 * chrome adapts to its own width with container queries, so it scales from a
 * phone column to a full hero.
 */
export function SafariMockup({
  url = "duskui.com",
  ratio = 16 / 10,
  tilt,
  src,
  alt,
  screenClassName,
  className,
  children,
  ...props
}: SafariMockupProps) {
  const t = useTilt(tiltAmount(tilt));
  return (
    <Stage tilt={t} data-slot="safari-mockup" className={cn("max-w-4xl", className)} {...props}>
      {(style) => (
        <motion.div
          style={style}
          className="overflow-hidden rounded-[clamp(8px,1.6cqw,14px)] border border-white/10 bg-[#141716] shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_30px_80px_-20px_rgb(0_0_0/0.8)] will-change-transform"
        >
          <div
            aria-hidden
            className="flex h-[clamp(28px,5.5cqw,44px)] items-center gap-[clamp(6px,1.4cqw,12px)] border-b border-white/[0.06] bg-[#1b1f1d] px-[clamp(8px,1.8cqw,16px)] text-white/40"
          >
            <span className="flex shrink-0 gap-[clamp(4px,0.8cqw,8px)]">
              {["bg-[#ff5f57]", "bg-[#febc2e]", "bg-[#28c840]"].map((color) => (
                <span key={color} className={cn("size-[clamp(7px,1.2cqw,12px)] rounded-full", color)} />
              ))}
            </span>
            <span className="hidden shrink-0 items-center gap-1 @md:flex [&_svg]:size-4">
              <ChevronLeft />
              <ChevronRight className="opacity-50" />
            </span>
            <span className="mx-auto flex h-[66%] min-w-0 max-w-md flex-1 items-center justify-center gap-1.5 rounded-[clamp(4px,0.8cqw,8px)] bg-white/[0.06] px-3 text-[clamp(9px,1.5cqw,13px)] text-white/60">
              <Lock className="size-[1em] shrink-0" />
              <span className="truncate">{url}</span>
              <RotateCw className="ml-auto hidden size-[1em] shrink-0 opacity-60 @lg:block" />
            </span>
            <span className="hidden shrink-0 items-center gap-3 @md:flex [&_svg]:size-4">
              <Share />
              <Plus />
            </span>
          </div>
          <div
            className={cn("relative overflow-hidden bg-background", screenClassName)}
            style={{ aspectRatio: ratio }}
          >
            <Screen src={src} alt={alt}>
              {children}
            </Screen>
          </div>
        </motion.div>
      )}
    </Stage>
  );
}

export interface PhoneMockupProps extends MockupBaseProps {
  /** Show the status bar (time, signal, battery) over the screen. */
  statusBar?: boolean;
  /** Time in the status bar. */
  time?: string;
  /** Classes for the status bar, e.g. `text-black` over a light screen. */
  statusBarClassName?: string;
  /** Frame finish. */
  color?: "graphite" | "silver" | "mint";
}

const finishes = {
  graphite: "bg-[linear-gradient(145deg,#3a3d3c,#151716_45%,#2a2d2c)]",
  silver: "bg-[linear-gradient(145deg,#e7e9e8,#a7abaa_45%,#d9dcdb)]",
  mint: "bg-[linear-gradient(145deg,color-mix(in_oklab,var(--color-primary)_55%,#1a2a25),#0d1c17_45%,color-mix(in_oklab,var(--color-primary)_35%,#13211c))]",
} as const;

/**
 * An iPhone-style frame drawn in CSS: rounded titanium body, side buttons,
 * a dynamic island and an optional status bar. Every dimension is a share of
 * the frame's width (container query units), so it scales cleanly at any size.
 * The screen content sits full-bleed under the island, like a real phone.
 */
export function PhoneMockup({
  statusBar = true,
  time = "9:41",
  statusBarClassName,
  color = "graphite",
  tilt,
  src,
  alt,
  screenClassName,
  className,
  children,
  ...props
}: PhoneMockupProps) {
  const t = useTilt(tiltAmount(tilt));
  const dark = color !== "silver";
  return (
    <Stage tilt={t} data-slot="phone-mockup" className={cn("max-w-[300px]", className)} {...props}>
      {(style) => (
        <motion.div
          style={style}
          className={cn(
            "relative rounded-[16cqw] p-[1.3cqw] will-change-transform",
            "shadow-[0_30px_70px_-20px_rgb(0_0_0/0.85),inset_0_0_0_1px_rgb(255_255_255/0.12)]",
            finishes[color]
          )}
        >
          {/* Side buttons: action, volume up/down on the left; power on the right. */}
          {[
            ["left", "17%", "6%"],
            ["left", "26%", "10%"],
            ["left", "38%", "10%"],
            ["right", "28%", "15%"],
          ].map(([side, top, height]) => (
            <span
              key={`${side}-${top}`}
              aria-hidden
              className={cn(
                "absolute w-[1.1cqw] rounded-full",
                finishes[color],
                side === "left" ? "-left-[0.7cqw]" : "-right-[0.7cqw]"
              )}
              style={{ top, height }}
            />
          ))}
          {/* Black bezel ring */}
          <div className="rounded-[14.8cqw] bg-black p-[2.6cqw]">
            <div
              className={cn(
                "relative aspect-[9/19.5] overflow-hidden rounded-[12.4cqw] bg-background",
                screenClassName
              )}
            >
              <Screen src={src} alt={alt}>
                {children}
              </Screen>
              {statusBar && (
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-x-0 top-0 z-10 flex h-[13cqw] items-center justify-between px-[8cqw] text-[4.4cqw] font-semibold text-white",
                    statusBarClassName
                  )}
                >
                  <span className="w-[16cqw] text-center tabular-nums">{time}</span>
                  <span className="flex items-center gap-[1.4cqw]">
                    <svg viewBox="0 0 18 12" className="h-[2.9cqw] fill-current">
                      <rect x="0" y="8" width="3" height="4" rx="0.8" />
                      <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" />
                      <rect x="10" y="3" width="3" height="9" rx="0.8" />
                      <rect x="15" y="0" width="3" height="12" rx="0.8" />
                    </svg>
                    <svg viewBox="0 0 16 12" className="h-[2.9cqw] fill-current">
                      <path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.2-1.3A10.3 10.3 0 0 0 8 .4 10.3 10.3 0 0 0 .8 3.3L2 4.6a8.5 8.5 0 0 1 6-2.4Zm0 3.6c1.3 0 2.5.5 3.4 1.3l1.2-1.3A6.7 6.7 0 0 0 8 4a6.7 6.7 0 0 0-4.6 1.8l1.2 1.3c.9-.8 2.1-1.3 3.4-1.3Zm0 3.6c-.5 0-1 .2-1.3.5L8 11.6l1.3-1.7c-.3-.3-.8-.5-1.3-.5Z" />
                    </svg>
                    <svg viewBox="0 0 27 12" className="h-[2.9cqw]">
                      <rect x="0.5" y="0.5" width="23" height="11" rx="3.2" fill="none" stroke="currentColor" strokeOpacity="0.45" />
                      <rect x="2.2" y="2.2" width="17" height="7.6" rx="1.8" fill="currentColor" />
                      <path d="M25 4v4c.8-.3 1.4-1.1 1.4-2S25.8 4.3 25 4Z" fill="currentColor" fillOpacity="0.45" />
                    </svg>
                  </span>
                </div>
              )}
              {/* Dynamic island */}
              <span
                aria-hidden
                className="absolute top-[3.2cqw] left-1/2 z-20 h-[9cqw] w-[30cqw] -translate-x-1/2 rounded-full bg-black"
              />
            </div>
          </div>
          {/* Edge highlight on the frame */}
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset",
              dark ? "ring-white/10" : "ring-black/10"
            )}
          />
        </motion.div>
      )}
    </Stage>
  );
}
