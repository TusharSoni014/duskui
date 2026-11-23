"use client";

import * as React from "react";
import { animate, useReducedMotion, type DOMKeyframesDefinition } from "motion/react";

type BlurFadeTag = "div" | "span" | "section" | "article" | "li" | "p" | "figure" | "header" | "footer";
type Direction = "up" | "down" | "left" | "right" | "none";

export interface BlurFadeProps extends React.HTMLAttributes<HTMLElement> {
  /** Element to render. */
  as?: BlurFadeTag;
  /** Where the content travels to: `up` starts below and rises into place. */
  direction?: Direction;
  /** Travel distance in px. */
  offset?: number;
  /** Starting blur in px. */
  blur?: number;
  /** Seconds before the entrance starts. */
  delay?: number;
  /** Seconds the entrance takes. */
  duration?: number;
  /** `inView` plays when the element scrolls into view; `mount` plays as soon as it mounts. */
  trigger?: "inView" | "mount";
  /** IntersectionObserver root margin. Negative values wait until the element is further inside the viewport. */
  inViewMargin?: string;
  /** How much of the element must be visible to start (0–1). */
  amount?: number;
  /** Play only the first time. When `false` it hides again on leaving the viewport and replays on every entry. */
  once?: boolean;
}

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

function hiddenFrame(direction: Direction, offset: number, blur: number): DOMKeyframesDefinition {
  const x = direction === "left" ? offset : direction === "right" ? -offset : 0;
  const y = direction === "up" ? offset : direction === "down" ? -offset : 0;
  return { opacity: 0, filter: `blur(${blur}px)`, transform: `translate3d(${x}px, ${y}px, 0)` };
}

const SHOWN: DOMKeyframesDefinition = {
  opacity: 1,
  filter: "blur(0px)",
  transform: "translate3d(0px, 0px, 0)",
};

/** `false` while React hydrates server HTML, `true` for any render that happens purely on the client. */
const noopSubscribe = () => () => {};
function useIsClientRender() {
  return React.useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}

/** Whether any part of the element is actually painted on screen, accounting for clipping scroll containers. */
function isOnScreen(el: Element) {
  const r = el.getBoundingClientRect();
  let top = Math.max(r.top, 0);
  let left = Math.max(r.left, 0);
  let bottom = Math.min(r.bottom, window.innerHeight);
  let right = Math.min(r.right, window.innerWidth);
  for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
    const style = getComputedStyle(node);
    if (style.overflowX !== "visible" || style.overflowY !== "visible") {
      const c = node.getBoundingClientRect();
      top = Math.max(top, c.top);
      left = Math.max(left, c.left);
      bottom = Math.min(bottom, c.bottom);
      right = Math.min(right, c.right);
    }
    if (bottom <= top || right <= left || style.position === "fixed") break;
  }
  return bottom > top && right > left;
}

type GroupContextValue = {
  /** `null` until the group has been measured, so items never hide on a guess. */
  inView: boolean | null;
  once: boolean;
};

const BlurFadeGroupContext = React.createContext<GroupContextValue | null>(null);

/**
 * Content fades in from a blur and a small offset when it enters the viewport
 * (or as soon as it mounts).
 *
 * The server renders the content fully visible, so crawlers and no-JS visitors
 * always get it. While hydrating, anything already on screen is left exactly as
 * painted (no flash of disappearing content); only content below the fold is
 * hidden, before it is ever seen, and animated in as it scrolls into view.
 * Client-side mounts (route changes, conditional renders) always animate, hidden
 * before the first paint. Animation runs through Motion on the element itself,
 * with no React state, and the blur is removed afterwards so it never traps
 * `position: fixed` or `backdrop-filter` children. Reduced motion shows
 * everything immediately.
 */
export function BlurFade({
  as = "div",
  direction = "up",
  offset = 8,
  blur = 6,
  delay = 0,
  duration = 0.5,
  trigger = "inView",
  inViewMargin = "-40px",
  amount = 0,
  once = true,
  children,
  ...props
}: BlurFadeProps) {
  const Comp = as as React.ElementType;
  const ref = React.useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const clientRender = useIsClientRender();
  const group = React.useContext(BlurFadeGroupContext);
  const groupInView = group?.inView;
  const replay = group ? !group.once : !once;
  // "init" until the first layout effect decides; then "hidden" (waiting) or "shown".
  const phase = React.useRef<"init" | "hidden" | "shown">("init");

  // Runs before the browser paints this commit: hide what nobody has seen yet.
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el || phase.current !== "init") return;
    if (reduceMotion || (!clientRender && isOnScreen(el))) {
      phase.current = "shown";
      return;
    }
    phase.current = "hidden";
    animate(el, hiddenFrame(direction, offset, blur), { duration: 0 });
  }, [reduceMotion, clientRender, direction, offset, blur]);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let controls: ReturnType<typeof animate> | undefined;
    let running = false;

    const show = (instant: boolean) => {
      if (phase.current !== "hidden") return;
      phase.current = "shown";
      running = true;
      el.style.willChange = "opacity, transform, filter";
      controls = animate(el, SHOWN, instant ? { duration: 0 } : { duration, delay, ease: EASE });
      controls.then(() => {
        running = false;
        if (phase.current !== "shown") return;
        // Remove the containing block that `filter`/`transform` create.
        el.style.filter = "";
        el.style.transform = "";
        el.style.willChange = "";
      });
    };
    const hide = () => {
      if (phase.current !== "shown") return;
      stop();
      phase.current = "hidden";
      animate(el, hiddenFrame(direction, offset, blur), { duration: 0 });
    };
    // An interrupted entrance (prop change, Strict Mode re-run) goes back to
    // "hidden" so the next run picks it up from wherever it stopped.
    function stop() {
      if (!running) return;
      running = false;
      controls?.stop();
      phase.current = "hidden";
    }

    if (reduceMotion) {
      show(true);
      return stop;
    }

    if (group) {
      if (groupInView === true) show(false);
      else if (groupInView === false && replay) hide();
      return stop;
    }

    if (trigger === "mount") {
      show(false);
      return stop;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show(false);
          if (!replay) observer.disconnect();
        } else if (replay) {
          hide();
        }
      },
      { rootMargin: inViewMargin, threshold: amount }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      stop();
    };
  }, [reduceMotion, group, groupInView, replay, trigger, inViewMargin, amount, direction, offset, blur, delay, duration]);

  return (
    <Comp ref={ref} data-slot="blur-fade" {...props}>
      {children}
    </Comp>
  );
}

type GroupTag = "div" | "ul" | "ol" | "section";

export interface BlurFadeGroupProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children">,
    Pick<BlurFadeProps, "direction" | "offset" | "blur" | "duration" | "inViewMargin" | "amount" | "once"> {
  /** Container element. `ul`/`ol` wrap each child in an `li`. */
  as?: GroupTag;
  /** Element wrapped around each child. Defaults to `li` inside lists, otherwise `div`. */
  itemAs?: BlurFadeTag;
  /** Class name for every item wrapper (e.g. grid cell styles). */
  itemClassName?: string;
  /** Seconds between consecutive children. */
  stagger?: number;
  /** Seconds before the first child starts. */
  delay?: number;
  /** `inView` waits for the group to scroll into view; `mount` plays immediately. */
  trigger?: "inView" | "mount";
  children: React.ReactNode;
}

/**
 * Staggers its children in with `BlurFade`. The group watches the viewport once
 * for all of them, so items in the same row never wait on each other and the
 * stagger always starts from the first child. Each child is wrapped in an item
 * element (`li` inside lists) that you can style with `itemClassName`.
 */
export function BlurFadeGroup({
  as = "div",
  itemAs,
  itemClassName,
  stagger = 0.08,
  delay = 0,
  trigger = "inView",
  inViewMargin = "-40px",
  amount = 0,
  once = true,
  direction,
  offset,
  blur,
  duration,
  children,
  ...props
}: BlurFadeGroupProps) {
  const Comp = as as React.ElementType;
  const ref = React.useRef<HTMLElement>(null);
  const [inView, setInView] = React.useState<boolean | null>(trigger === "mount" ? true : null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || trigger === "mount") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { rootMargin: inViewMargin, threshold: amount }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [trigger, inViewMargin, amount, once]);

  const context = React.useMemo(() => ({ inView, once }), [inView, once]);
  const Item = itemAs ?? (as === "ul" || as === "ol" ? "li" : "div");

  return (
    <BlurFadeGroupContext.Provider value={context}>
      <Comp ref={ref} data-slot="blur-fade-group" {...props}>
        {React.Children.toArray(children).map((child, index) => (
          <BlurFade
            key={React.isValidElement(child) && child.key != null ? child.key : index}
            as={Item}
            className={itemClassName}
            delay={delay + index * stagger}
            direction={direction}
            offset={offset}
            blur={blur}
            duration={duration}
          >
            {child}
          </BlurFade>
        ))}
      </Comp>
    </BlurFadeGroupContext.Provider>
  );
}
