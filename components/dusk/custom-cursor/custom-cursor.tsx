"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type SpringOptions,
} from "motion/react";

import { cn } from "@/lib/utils";

const HOVER_SELECTOR =
  'a[href], button:not(:disabled), [role="button"], [role="link"], label[for], summary, select, [data-cursor="hover"], [data-cursor-label]';
const NATIVE_SELECTOR =
  'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]), textarea, [contenteditable=""], [contenteditable="true"], [data-cursor="native"]';

// The native cursor is hidden only where the custom one is drawn; text fields keep their caret.
const CURSOR_CSS = `
[data-dusk-cursor="on"], [data-dusk-cursor="on"] * { cursor: none !important; }
[data-dusk-cursor="on"] :is(${NATIVE_SELECTOR}), [data-dusk-cursor="on"] :is(${NATIVE_SELECTOR}) * { cursor: auto !important; }
`;

export interface CustomCursorProps extends React.ComponentProps<"div"> {
  /**
   * `container` draws the cursor only inside this element (which wraps `children`).
   * `page` draws it over the whole document; render it once, anywhere.
   */
  scope?: "container" | "page";
  /** Diameter of the trailing ring in px. */
  ringSize?: number;
  /** Ring diameter over links, buttons and `[data-cursor="hover"]`. */
  hoverSize?: number;
  /** Ring diameter when the hovered element has a `data-cursor-label`. */
  labelSize?: number;
  /** Diameter of the dot in px. */
  dotSize?: number;
  /** Spring for the ring. The dot uses a much stiffer one so it stays under the pointer. */
  spring?: SpringOptions;
  /** Extra selector for elements that should enlarge the ring. Links and buttons are always included. */
  hoverSelector?: string;
}

type CursorState = {
  visible: boolean;
  mode: "idle" | "hover" | "native";
  label: string | null;
  pressed: boolean;
};

const IDLE: CursorState = { visible: false, mode: "idle", label: null, pressed: false };

function sameState(a: CursorState, b: CursorState) {
  return a.visible === b.visible && a.mode === b.mode && a.label === b.label && a.pressed === b.pressed;
}

/** True only on the client, for a fine pointer (mouse / trackpad). `false` during SSR and hydration. */
function useFinePointer() {
  return React.useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(hover: hover) and (pointer: fine)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    () => false
  );
}

/**
 * A smooth trailing cursor: a dot that sits on the pointer and a ring that
 * follows on a spring. The ring grows over links, buttons and anything with
 * `data-cursor="hover"`, and shows the text of `data-cursor-label` inside it.
 * Over text fields (or `data-cursor="native"`) it steps aside for the caret.
 *
 * Scoped to its own container by default, so the native cursor is hidden only
 * there. Pointer positions are motion values, so moving never re-renders React.
 * Touch devices, coarse pointers and reduced motion keep the native cursor and
 * render nothing extra. The drawn layers are `aria-hidden` and never take
 * pointer events.
 */
export function CustomCursor({
  scope = "container",
  ringSize = 32,
  hoverSize = 56,
  labelSize = 76,
  dotSize = 6,
  spring = { stiffness: 380, damping: 32, mass: 0.6 },
  hoverSelector,
  className,
  children,
  onPointerMove,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
  onPointerUp,
  ...props
}: CustomCursorProps) {
  const reduceMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const enabled = finePointer && !reduceMotion;

  const rootRef = React.useRef<HTMLDivElement>(null);
  const [state, setState] = React.useState<CursorState>(IDLE);
  const update = React.useCallback((patch: Partial<CursorState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      return sameState(prev, next) ? prev : next;
    });
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const ringX = useSpring(x, spring);
  const ringY = useSpring(y, spring);
  const dotX = useSpring(x, { stiffness: 1400, damping: 60, mass: 0.2 });
  const dotY = useSpring(y, { stiffness: 1400, damping: 60, mass: 0.2 });
  const last = React.useRef({ clientX: 0, clientY: 0, seen: false });

  const selector = hoverSelector ? `${HOVER_SELECTOR}, ${hoverSelector}` : HOVER_SELECTOR;

  /** Places the cursor and works out what it is over. Shared by both scopes. */
  const track = React.useCallback(
    (clientX: number, clientY: number, target: EventTarget | null) => {
      const root = rootRef.current;
      let px = clientX;
      let py = clientY;
      if (scope === "container" && root) {
        const rect = root.getBoundingClientRect();
        px = clientX - rect.left + root.scrollLeft;
        py = clientY - rect.top + root.scrollTop;
      }
      const firstMove = !last.current.seen;
      last.current = { clientX, clientY, seen: true };
      if (firstMove) {
        // Appear under the pointer instead of flying in from the corner.
        x.jump(px);
        y.jump(py);
        ringX.jump(px);
        ringY.jump(py);
        dotX.jump(px);
        dotY.jump(py);
      } else {
        x.set(px);
        y.set(py);
      }

      const el = target instanceof Element ? target : null;
      const limit = scope === "container" ? root : document.documentElement;
      const inside = (node: Element | null) => (node && limit?.contains(node) ? node : null);
      if (inside(el?.closest(NATIVE_SELECTOR) ?? null)) {
        update({ visible: true, mode: "native", label: null });
        return;
      }
      const hit = inside(el?.closest(selector) ?? null);
      const label = hit?.closest("[data-cursor-label]")?.getAttribute("data-cursor-label") || null;
      update({ visible: true, mode: hit ? "hover" : "idle", label });
    },
    [scope, selector, update, x, y, ringX, ringY, dotX, dotY]
  );

  const hideCursor = React.useCallback(() => {
    last.current.seen = false;
    update({ visible: false, pressed: false });
  }, [update]);

  // Mark the scope so the injected stylesheet hides the native cursor there only.
  React.useEffect(() => {
    if (!enabled) return;
    const target = scope === "page" ? document.documentElement : rootRef.current;
    if (!target) return;
    target.setAttribute("data-dusk-cursor", "on");
    return () => target.removeAttribute("data-dusk-cursor");
  }, [enabled, scope]);

  // Page scope: follow the pointer on the window.
  React.useEffect(() => {
    if (!enabled || scope !== "page") return;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      track(event.clientX, event.clientY, event.target);
    };
    const down = (event: PointerEvent) => event.pointerType === "mouse" && update({ pressed: true });
    const up = () => update({ pressed: false });
    const leave = () => hideCursor();
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
    };
  }, [enabled, scope, track, update, hideCursor]);

  // Container scope: keep the cursor glued to the pointer while the page scrolls under it.
  React.useEffect(() => {
    if (!enabled || scope !== "container" || !state.visible) return;
    const onScroll = () => {
      const { clientX, clientY, seen } = last.current;
      if (!seen) return;
      track(clientX, clientY, document.elementFromPoint(clientX, clientY));
    };
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => window.removeEventListener("scroll", onScroll, { capture: true });
  }, [enabled, scope, state.visible, track]);

  const fixed = scope === "page";
  const size =
    state.mode === "hover" ? (state.label ? labelSize : hoverSize) : ringSize;
  const showLayers = state.visible && state.mode !== "native";

  const layers = enabled ? (
    <div
      aria-hidden
      data-slot="custom-cursor"
      // Container scope: no clipping here, so the ring can follow into scrolled content; the container clips.
      className={cn("pointer-events-none inset-0 z-[9999]", fixed ? "fixed overflow-hidden" : "absolute")}
    >
      <style href="dusk-custom-cursor" precedence="default">
        {CURSOR_CSS}
      </style>
      <motion.div className="absolute left-0 top-0" style={{ x: ringX, y: ringY }}>
        <motion.div
          className="absolute grid place-items-center rounded-full border border-primary/60 shadow-[0_0_18px_-6px_var(--color-primary)]"
          initial={false}
          animate={{
            width: size,
            height: size,
            x: -size / 2,
            y: -size / 2,
            opacity: showLayers ? 1 : 0,
            scale: state.pressed ? 0.82 : 1,
          }}
          transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.5, opacity: { duration: 0.18 } }}
        >
          <motion.span
            className="absolute inset-0 rounded-full bg-primary"
            initial={false}
            animate={{ opacity: state.label ? 0.92 : state.mode === "hover" ? 0.14 : 0 }}
            transition={{ duration: 0.2 }}
          />
          <AnimatePresence>
            {state.label && showLayers && (
              <motion.span
                key={state.label}
                className="relative px-2 text-center text-[11px] font-semibold uppercase leading-tight tracking-wider text-primary-foreground"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.18 }}
              >
                {state.label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <motion.div className="absolute left-0 top-0" style={{ x: dotX, y: dotY }}>
        <motion.div
          className="absolute rounded-full bg-primary"
          style={{ width: dotSize, height: dotSize, left: -dotSize / 2, top: -dotSize / 2 }}
          initial={false}
          animate={{ opacity: showLayers && state.mode === "idle" ? 1 : 0, scale: showLayers && state.mode === "idle" ? 1 : 0.2 }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>
    </div>
  ) : null;

  if (scope === "page") {
    return (
      <>
        {children}
        {layers && createPortal(layers, document.body)}
      </>
    );
  }

  return (
    <div
      ref={rootRef}
      data-slot="custom-cursor-area"
      className={cn("relative", className)}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        if (enabled && event.pointerType === "mouse") track(event.clientX, event.clientY, event.target);
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (enabled && event.pointerType === "mouse") track(event.clientX, event.clientY, event.target);
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        if (enabled) hideCursor();
      }}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (enabled && event.pointerType === "mouse") update({ pressed: true });
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event);
        if (enabled) update({ pressed: false });
      }}
      {...props}
    >
      {children}
      {layers}
    </div>
  );
}
