"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export type IconCloudItem = {
  /** Accessible name, also shown as a tooltip. */
  label: string;
  /** Turns the icon into a link. */
  href?: string;
} & ({ icon: React.ReactNode; src?: never } | { src: string; icon?: never });

export interface IconCloudProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** The icons: a React node (`icon`) or an image URL (`src`), each with a `label`. */
  items: IconCloudItem[];
  /** Width and height of each icon slot in px. */
  iconSize?: number;
  /** Idle spin in radians per second. */
  speed?: number;
  /** Steer the spin toward the cursor while hovering (mouse only). */
  steerOnHover?: boolean;
  /** Let people spin the sphere by dragging, with momentum on release. */
  draggable?: boolean;
  /** Scale of the icons nearest to the viewer. Far icons shrink to about half of it. */
  maxScale?: number;
  /** Accessible name of the list. */
  label?: string;
  /** Classes for each icon slot. */
  itemClassName?: string;
}

type Vec3 = [number, number, number];
/** Row-major 3×3 rotation matrix. */
type Mat3 = [number, number, number, number, number, number, number, number, number];

/** Evenly spread points on a unit sphere (golden-angle spiral), so the layout is the same on every render. */
function fibonacciSphere(count: number): Vec3[] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, i) => {
    const y = 1 - ((i + 0.5) / count) * 2;
    const r = Math.sqrt(1 - y * y);
    const a = i * golden;
    return [Math.cos(a) * r, y, Math.sin(a) * r];
  });
}

/** Rotation around screen X by `ax`, then screen Y by `ay`, applied on top of `m`. */
function rotate(m: Mat3, ax: number, ay: number): Mat3 {
  const cx = Math.cos(ax);
  const sx = Math.sin(ax);
  const cy = Math.cos(ay);
  const sy = Math.sin(ay);
  // R = Ry(ay) · Rx(ax)
  const r: Mat3 = [cy, sy * sx, sy * cx, 0, cx, -sx, -sy, cy * sx, cy * cx];
  const out = new Array(9) as Mat3;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      out[row * 3 + col] =
        r[row * 3] * m[col] + r[row * 3 + 1] * m[3 + col] + r[row * 3 + 2] * m[6 + col];
    }
  }
  return out;
}

/** Re-orthonormalizes the matrix so floating-point drift never skews the sphere. */
function orthonormalize(m: Mat3): Mat3 {
  const a: Vec3 = [m[0], m[1], m[2]];
  const la = Math.hypot(...a) || 1;
  const x: Vec3 = [a[0] / la, a[1] / la, a[2] / la];
  const b: Vec3 = [m[3], m[4], m[5]];
  const d = b[0] * x[0] + b[1] * x[1] + b[2] * x[2];
  const by: Vec3 = [b[0] - d * x[0], b[1] - d * x[1], b[2] - d * x[2]];
  const lb = Math.hypot(...by) || 1;
  const y: Vec3 = [by[0] / lb, by[1] / lb, by[2] / lb];
  const z: Vec3 = [x[1] * y[2] - x[2] * y[1], x[2] * y[0] - x[0] * y[2], x[0] * y[1] - x[1] * y[0]];
  return [...x, ...y, ...z];
}

/** A fixed starting tilt so the sphere reads as 3D before it moves. */
const INITIAL: Mat3 = rotate([1, 0, 0, 0, 1, 0, 0, 0, 1], -0.35, 0.4);

const round = (n: number) => Math.round(n * 1000) / 1000;

/** Projected style for one point: position as a fraction of the radius, plus depth-driven scale and opacity. */
function project(m: Mat3, p: Vec3, maxScale: number) {
  const x = m[0] * p[0] + m[1] * p[1] + m[2] * p[2];
  const y = m[3] * p[0] + m[4] * p[1] + m[5] * p[2];
  const z = m[6] * p[0] + m[7] * p[1] + m[8] * p[2];
  // depth: 0 at the back, 1 nearest the viewer.
  const depth = (z + 1) / 2;
  return {
    x: round(x),
    y: round(y),
    scale: round(maxScale * (0.5 + 0.5 * depth)),
    opacity: round(0.22 + 0.78 * depth * depth),
    z: Math.round(depth * 100),
  };
}

/** A slowly rotating 3D sphere of icons that you can steer by hovering or spin by dragging, with nearer icons larger and brighter. */
export function IconCloud({
  items,
  iconSize = 40,
  speed = 0.35,
  steerOnHover = true,
  draggable = true,
  maxScale = 1.1,
  label = "Icons",
  itemClassName,
  className,
  style,
  ...props
}: IconCloudProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<(HTMLLIElement | null)[]>([]);
  const points = React.useMemo(() => fibonacciSphere(items.length), [items.length]);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let matrix = INITIAL;
    let frames = 0;
    const idle = { x: -speed * 0.25, y: speed };
    // Angular velocity in rad/s around the screen X and Y axes.
    const velocity = { ...idle };
    const target = { ...idle };
    const pointer = { hovering: false, dragging: false, lastX: 0, lastY: 0, lastT: 0 };
    let focused = false;
    let onScreen = false;
    let raf = 0;
    let last = 0;

    const paint = () => {
      for (let i = 0; i < points.length; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        const p = project(matrix, points[i], maxScale);
        el.style.setProperty("--x", String(p.x));
        el.style.setProperty("--y", String(p.y));
        el.style.setProperty("--s", String(p.scale));
        el.style.opacity = String(p.opacity);
        el.style.zIndex = String(p.z);
      }
    };

    const turn = (ax: number, ay: number) => {
      matrix = rotate(matrix, ax, ay);
      if (++frames % 60 === 0) matrix = orthonormalize(matrix);
    };

    const animating = () => !reduceMotion && onScreen && !document.hidden;

    const frame = (now: number) => {
      raf = 0;
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      if (!pointer.dragging) {
        // Ease toward the target spin: hover steering, idle drift, or the tail of a fling.
        const k = 1 - Math.exp(-dt * (pointer.hovering ? 4 : 1.2));
        const goal = focused ? { x: 0, y: 0 } : target;
        velocity.x += (goal.x - velocity.x) * k;
        velocity.y += (goal.y - velocity.y) * k;
        turn(velocity.x * dt, velocity.y * dt);
      }
      paint();
      if (animating()) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!raf && animating()) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const radius = () => Math.max(1, root.clientWidth / 2 - iconSize / 2);

    const onPointerMove = (e: PointerEvent) => {
      if (pointer.dragging) {
        const dx = e.clientX - pointer.lastX;
        const dy = e.clientY - pointer.lastY;
        const now = e.timeStamp;
        const dt = Math.max(0.001, (now - pointer.lastT) / 1000);
        const r = radius();
        turn(-dy / r, dx / r);
        // Track the drag speed so the release keeps spinning.
        velocity.x = velocity.x * 0.5 + (-dy / r / dt) * 0.5;
        velocity.y = velocity.y * 0.5 + (dx / r / dt) * 0.5;
        pointer.lastX = e.clientX;
        pointer.lastY = e.clientY;
        pointer.lastT = now;
        if (!raf) paint();
        return;
      }
      if (!steerOnHover || reduceMotion || e.pointerType !== "mouse") return;
      const rect = root.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      pointer.hovering = true;
      // Icons drift toward the cursor's side; the further out, the faster.
      target.x = -ny * speed * 4;
      target.y = nx * speed * 4;
    };

    const onPointerLeave = () => {
      pointer.hovering = false;
      target.x = idle.x;
      target.y = idle.y;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!draggable || (e.pointerType === "mouse" && e.button !== 0)) return;
      if ((e.target as HTMLElement).closest("a")) return;
      pointer.dragging = true;
      pointer.lastX = e.clientX;
      pointer.lastY = e.clientY;
      pointer.lastT = e.timeStamp;
      velocity.x = 0;
      velocity.y = 0;
      root.setPointerCapture(e.pointerId);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!pointer.dragging) return;
      pointer.dragging = false;
      if (root.hasPointerCapture(e.pointerId)) root.releasePointerCapture(e.pointerId);
      // Ignore a stale velocity if the pointer rested before letting go.
      if (e.timeStamp - pointer.lastT > 80) {
        velocity.x = 0;
        velocity.y = 0;
      }
      const cap = 8;
      velocity.x = Math.max(-cap, Math.min(cap, velocity.x));
      velocity.y = Math.max(-cap, Math.min(cap, velocity.y));
      if (e.pointerType !== "mouse") onPointerLeave();
    };

    const onFocusIn = () => {
      focused = true;
    };
    const onFocusOut = (e: FocusEvent) => {
      if (!root.contains(e.relatedTarget as Node | null)) focused = false;
    };

    const intersection = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    intersection.observe(root);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerleave", onPointerLeave);
    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointerup", onPointerUp);
    root.addEventListener("pointercancel", onPointerUp);
    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", onFocusOut);
    paint();

    return () => {
      stop();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("pointercancel", onPointerUp);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
    };
  }, [points, speed, steerOnHover, draggable, maxScale, iconSize, reduceMotion]);

  return (
    <div
      ref={rootRef}
      data-slot="icon-cloud"
      className={cn(
        "relative aspect-square w-full max-w-[400px] select-none [container-type:inline-size]",
        draggable && "cursor-grab touch-pan-y active:cursor-grabbing",
        className
      )}
      style={
        {
          ...style,
          // Sphere radius: half the container minus half an icon, so icons never poke out.
          "--r": `calc(50cqw - ${iconSize / 2}px)`,
        } as React.CSSProperties
      }
      {...props}
    >
      <ul aria-label={label} className="absolute inset-0">
        {items.map((item, i) => {
          // The first paint is computed here so server and client agree and nothing jumps on hydration.
          const p = project(INITIAL, points[i], maxScale);
          const content = item.src ? (
            // eslint-disable-next-line @next/next/no-img-element -- plain <img> keeps the component framework-agnostic.
            <img src={item.src} alt="" draggable={false} className="size-full object-contain" />
          ) : (
            item.icon
          );
          const visual = (
            <span aria-hidden className="flex size-full items-center justify-center [&_svg]:size-[60%]">
              {content}
            </span>
          );
          return (
            <li
              key={`${item.label}-${i}`}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              data-slot="icon-cloud-item"
              title={item.label}
              className={cn("absolute left-1/2 top-1/2 will-change-transform", itemClassName)}
              style={
                {
                  width: iconSize,
                  height: iconSize,
                  marginLeft: -iconSize / 2,
                  marginTop: -iconSize / 2,
                  "--x": p.x,
                  "--y": p.y,
                  "--s": p.scale,
                  opacity: p.opacity,
                  zIndex: p.z,
                  transform:
                    "translate3d(calc(var(--x) * var(--r)), calc(var(--y) * var(--r)), 0) scale(var(--s))",
                } as React.CSSProperties
              }
            >
              {item.href ? (
                <a
                  href={item.href}
                  className="block size-full rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                  draggable={false}
                >
                  {visual}
                  <span className="sr-only">{item.label}</span>
                </a>
              ) : (
                <>
                  {visual}
                  <span className="sr-only">{item.label}</span>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
