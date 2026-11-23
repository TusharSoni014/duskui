"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

import { cn } from "@/lib/utils";

type Position = "bottom" | "top" | "left" | "right";

type DockContextValue = {
  pointer: MotionValue<number>;
  position: Position;
  vertical: boolean;
  iconSize: number;
  magnification: number;
  distance: number;
  /** False on touch-only use and under reduced motion. */
  magnify: boolean;
};

const DockContext = React.createContext<DockContextValue | null>(null);

function useDock() {
  const context = React.useContext(DockContext);
  if (!context) throw new Error("DockItem must be used inside <Dock>.");
  return context;
}

const sizeSpring = { mass: 0.1, stiffness: 170, damping: 14 };

export interface DockProps extends Omit<React.ComponentProps<"nav">, "children"> {
  children: React.ReactNode;
  /** The screen edge the dock sits on. Icons grow away from it; `left` / `right` make it vertical. */
  position?: Position;
  /** Resting icon size, in px. */
  iconSize?: number;
  /** Size of the icon right under the cursor, in px. */
  magnification?: number;
  /** How far from the cursor (in px) icons start to grow. */
  distance?: number;
  /** Turn magnification off (it's always off for touch and under reduced motion). */
  disableMagnification?: boolean;
}

/**
 * A macOS-style dock. Icons swell as the cursor approaches — each one's size
 * comes from its distance to the pointer through motion values and springs,
 * so moving the mouse never re-renders React. Keyboard focus magnifies too,
 * labels pop out on hover and focus, and an active dot glides between items.
 *
 * The bar keeps its height: icons grow out of it, so nothing around it moves.
 * Static on touch screens and under reduced motion. Arrow keys move between items.
 */
export function Dock({
  position = "bottom",
  iconSize = 44,
  magnification = 72,
  distance = 140,
  disableMagnification = false,
  className,
  style,
  children,
  "aria-label": ariaLabel = "Dock",
  ...props
}: DockProps) {
  const layoutId = React.useId();
  const reduceMotion = useReducedMotion() ?? false;
  const pointer = useMotionValue(Infinity);
  const vertical = position === "left" || position === "right";
  const magnify = !disableMagnification && !reduceMotion;

  const context = React.useMemo(
    () => ({ pointer, position, vertical, iconSize, magnification, distance, magnify }),
    [pointer, position, vertical, iconSize, magnification, distance, magnify]
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    const prevKey = vertical ? "ArrowUp" : "ArrowLeft";
    const nextKey = vertical ? "ArrowDown" : "ArrowRight";
    if (![prevKey, nextKey, "Home", "End"].includes(event.key)) return;
    const targets = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("[data-dock-target]"));
    const index = targets.indexOf(document.activeElement as HTMLElement);
    if (index === -1) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? targets.length - 1
          : (index + (event.key === nextKey ? 1 : -1) + targets.length) % targets.length;
    targets[next]?.focus();
  };

  const pad = 8;

  return (
    <DockContext.Provider value={context}>
      <nav
        aria-label={ariaLabel}
        data-slot="dock"
        data-position={position}
        className={cn(
          "relative inline-flex rounded-2xl border border-white/10 bg-background/60 shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_16px_40px_-16px_rgb(0_0_0/0.8)]",
          "supports-[backdrop-filter]:bg-background/40 supports-[backdrop-filter]:backdrop-blur-xl",
          className
        )}
        style={{ ...(vertical ? { width: iconSize + pad * 2 } : { height: iconSize + pad * 2 }), ...style }}
        {...props}
      >
        <LayoutGroup id={layoutId}>
          <ul
            className={cn(
              "flex gap-2",
              vertical ? "flex-col" : "flex-row",
              {
                bottom: "items-end",
                top: "items-start",
                left: "items-start",
                right: "items-end",
              }[position]
            )}
            style={{ padding: pad, ...(vertical ? { width: "100%" } : { height: "100%" }) }}
            onPointerMove={(event) => {
              if (!magnify || event.pointerType !== "mouse") return;
              pointer.set(vertical ? event.clientY : event.clientX);
            }}
            onPointerLeave={() => pointer.set(Infinity)}
            onKeyDown={handleKeyDown}
          >
            {children}
          </ul>
        </LayoutGroup>
      </nav>
    </DockContext.Provider>
  );
}

const labelPlacement: Record<Position, string> = {
  bottom: "bottom-full left-1/2 mb-3 -translate-x-1/2",
  top: "top-full left-1/2 mt-3 -translate-x-1/2",
  left: "left-full top-1/2 ml-3 -translate-y-1/2",
  right: "right-full top-1/2 mr-3 -translate-y-1/2",
};

const labelOffset: Record<Position, { x?: number; y?: number }> = {
  bottom: { y: 4 },
  top: { y: -4 },
  left: { x: -4 },
  right: { x: 4 },
};

const dotPlacement: Record<Position, string> = {
  bottom: "-bottom-1.5 inset-x-0 mx-auto",
  top: "-top-1.5 inset-x-0 mx-auto",
  left: "-left-1.5 inset-y-0 my-auto",
  right: "-right-1.5 inset-y-0 my-auto",
};

export interface DockItemProps
  extends Omit<React.ComponentProps<"button">, "children"> {
  /** Accessible name, shown as the hover / focus label. */
  label: string;
  /** The icon. Sized to 45% of the item automatically. */
  children: React.ReactNode;
  /** Render a link. */
  href?: string;
  /** Show the active dot (and aria-current="page" on links). */
  active?: boolean;
  /** Render your own element (e.g. Next.js `Link` wrapping the icon) instead of a button / anchor. */
  asChild?: boolean;
}

/** An icon in the dock. Renders a `<button>`, an `<a>` with `href`, or your own element with `asChild`. */
export function DockItem({
  label,
  href,
  active = false,
  asChild = false,
  className,
  children,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: DockItemProps) {
  const { pointer, position, vertical, iconSize, magnification, distance, magnify } = useDock();
  const ref = React.useRef<HTMLLIElement>(null);
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const reduceMotion = useReducedMotion();

  const offset = useTransform(pointer, (p) => {
    const el = ref.current;
    if (!Number.isFinite(p) || !el) return Infinity;
    const rect = el.getBoundingClientRect();
    return p - (vertical ? rect.top + rect.height / 2 : rect.left + rect.width / 2);
  });
  const target = useTransform(offset, [-distance, 0, distance], [iconSize, magnification, iconSize]);
  const size = useSpring(target, sizeSpring);

  const centre = () => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return Infinity;
    return vertical ? rect.top + rect.height / 2 : rect.left + rect.width / 2;
  };

  const Comp: React.ElementType = asChild ? Slot : href ? "a" : "button";
  const showLabel = hovered || focused;

  return (
    <motion.li
      ref={ref}
      data-slot="dock-item"
      className="relative shrink-0"
      style={{ width: magnify ? size : iconSize, height: magnify ? size : iconSize }}
    >
      <AnimatePresence>
        {showLabel && (
          <motion.span
            aria-hidden
            initial={{ opacity: 0, scale: 0.9, ...(reduceMotion ? {} : labelOffset[position]) }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
            transition={{ type: "spring", duration: 0.25, bounce: 0.2 }}
            className={cn(
              "pointer-events-none absolute z-10 rounded-md border border-white/10 bg-popover px-2 py-1 text-xs font-medium whitespace-nowrap text-popover-foreground",
              "shadow-[0_8px_24px_-8px_rgb(0_0_0/0.8)]",
              labelPlacement[position]
            )}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      <Comp
        data-dock-target
        aria-label={label}
        aria-current={active ? (Comp === "button" ? "true" : "page") : undefined}
        {...(Comp === "button" ? { type: "button" } : {})}
        {...(href && !asChild ? { href } : {})}
        className={cn(
          "flex size-full items-center justify-center rounded-[28%] border border-white/10 bg-linear-to-b from-white/12 to-white/4 text-foreground outline-none",
          "shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_4px_12px_-4px_rgb(0_0_0/0.6)]",
          "transition-[background-color,border-color,box-shadow] duration-200 hover:border-white/20",
          "focus-visible:ring-[3px] focus-visible:ring-ring/60",
          "[&_svg]:pointer-events-none [&_svg]:size-[45%] [&_svg]:shrink-0",
          active && "border-primary/30 text-primary",
          className
        )}
        onPointerEnter={(event: React.PointerEvent<HTMLButtonElement>) => {
          onPointerEnter?.(event);
          if (event.pointerType === "mouse") setHovered(true);
        }}
        onPointerLeave={(event: React.PointerEvent<HTMLButtonElement>) => {
          onPointerLeave?.(event);
          setHovered(false);
        }}
        onFocus={(event: React.FocusEvent<HTMLButtonElement>) => {
          onFocus?.(event);
          if (!event.currentTarget.matches(":focus-visible")) return;
          setFocused(true);
          // Keyboard focus magnifies the item and its neighbours, as if the cursor were on it.
          if (magnify) pointer.set(centre());
        }}
        onBlur={(event: React.FocusEvent<HTMLButtonElement>) => {
          onBlur?.(event);
          setFocused(false);
          const next = event.relatedTarget as HTMLElement | null;
          if (!next?.closest("[data-slot=dock]")) pointer.set(Infinity);
        }}
        {...props}
      >
        {children}
      </Comp>

      {active && (
        <motion.span
          layoutId="dock-active-dot"
          aria-hidden
          transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
          className={cn(
            "pointer-events-none absolute size-1 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]",
            dotPlacement[position]
          )}
        />
      )}
    </motion.li>
  );
}

/** A thin divider between groups of items. */
export function DockSeparator({ className, ...props }: React.ComponentProps<"li">) {
  const { vertical } = useDock();
  return (
    <li
      aria-hidden
      data-slot="dock-separator"
      className={cn(
        "shrink-0 self-center bg-white/12",
        vertical ? "mx-1 h-px w-[calc(100%-0.5rem)]" : "my-1 h-[70%] w-px",
        className
      )}
      {...props}
    />
  );
}
