"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import {
  animate,
  LayoutGroup,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  type AnimationPlaybackControls,
  type MotionValue,
  type PanInfo,
} from "motion/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

type Align = "start" | "center";

type Metrics = {
  viewport: number;
  /** Slide offsets from the first slide, in px. */
  offsets: number[];
  widths: number[];
  gap: number;
  /** One full lap of the track (all slides + gaps), in px. */
  length: number;
};

type SlideRegistration = {
  shift: MotionValue<number>;
  progress: MotionValue<number>;
};

const mod = (n: number, m: number) => ((n % m) + m) % m;
const subscribeNoop = () => () => {};

/** false during SSR and hydration, true after — keeps reduced-motion-dependent markup hydration-safe. */
function useHydrated() {
  return React.useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );
}

const slideSpring = { type: "spring", stiffness: 260, damping: 34, mass: 0.9, restDelta: 0.5 } as const;

/** Snap targets (track x for each snap) and which snap each slide belongs to. */
function computeSnaps(metrics: Metrics | null, align: Align, loop: boolean, count: number) {
  if (!metrics || metrics.offsets.length === 0) {
    const ids = Array.from({ length: count }, (_, i) => i);
    return { targets: ids.map(() => 0), slideToSnap: ids };
  }
  const { viewport, offsets, widths, gap, length } = metrics;
  const raw = offsets.map((o, i) => (align === "start" ? -o : (viewport - widths[i]) / 2 - o));
  if (loop || align === "center") return { targets: raw, slideToSnap: raw.map((_, i) => i) };

  // Start-aligned without loop: don't scroll past the last slide, and merge duplicate end snaps.
  const min = Math.min(0, viewport - (length - gap));
  const targets: number[] = [];
  const slideToSnap: number[] = [];
  for (const t of raw) {
    const clamped = Math.min(0, Math.max(min, t));
    if (targets.length === 0 || Math.abs(clamped - targets[targets.length - 1]) > 1) targets.push(clamped);
    slideToSnap.push(targets.length - 1);
  }
  return { targets, slideToSnap };
}

/* -------------------------------------------------------------------------- */
/*                                   Context                                  */
/* -------------------------------------------------------------------------- */

type CarouselContextValue = {
  x: MotionValue<number>;
  viewportRef: React.RefObject<HTMLDivElement | null>;
  trackRef: React.RefObject<HTMLDivElement | null>;
  trackId: string;
  selected: number;
  snapCount: number;
  slideToSnap: number[];
  canPrev: boolean;
  canNext: boolean;
  canDrag: boolean;
  dragConstraints: { left: number; right: number } | false;
  autoplayEnabled: boolean;
  playing: boolean;
  running: boolean;
  prev: () => void;
  next: () => void;
  goTo: (snap: number) => void;
  togglePlaying: () => void;
  register: (index: number, slide: SlideRegistration) => () => void;
  setSlideCount: (count: number) => void;
  onDragStart: () => void;
  onDragEnd: (info: PanInfo) => void;
  onSlideFocus: (index: number, target: HTMLElement) => void;
};

const CarouselContext = React.createContext<CarouselContextValue | null>(null);
const SlideContext = React.createContext<{ index: number; count: number } | null>(null);

function useCarouselContext() {
  const context = React.useContext(CarouselContext);
  if (!context) throw new Error("Carousel parts must be used inside <Carousel>.");
  return context;
}

/** State and controls for building custom carousel controls. */
export function useCarousel() {
  const { selected, snapCount, canPrev, canNext, prev, next, goTo, playing, togglePlaying, autoplayEnabled } =
    useCarouselContext();
  return { selected, snapCount, canPrev, canNext, prev, next, goTo, playing, togglePlaying, autoplayEnabled };
}

const SlideMotionContext = React.createContext<SlideRegistration | null>(null);

/**
 * Inside a CarouselItem: `progress` is how far the slide is from its resting
 * position, in slides (0 = selected, -1 = one to the left, 1 = one to the right).
 * Map it with `useTransform` for custom effects. Updates every frame without re-rendering.
 */
export function useCarouselSlide() {
  const slide = React.useContext(SlideContext);
  const motionValues = React.useContext(SlideMotionContext);
  if (!slide || !motionValues) throw new Error("useCarouselSlide must be used inside <CarouselItem>.");
  return { index: slide.index, count: slide.count, progress: motionValues.progress };
}

/* -------------------------------------------------------------------------- */
/*                                   Carousel                                 */
/* -------------------------------------------------------------------------- */

export interface CarouselProps extends React.ComponentProps<"div"> {
  /** Wrap around endlessly. Falls back to rewinding when there aren't enough slides to fill the loop. */
  loop?: boolean;
  /** Where the selected slide rests. */
  align?: Align;
  /** Advance automatically: `true` for every 5s, or an interval in ms. Pauses on hover, keyboard focus, drag and reduced motion. */
  autoplay?: boolean | number;
  /** Slide selected on mount. */
  defaultIndex?: number;
  /** Called with the new snap index whenever the selection changes. */
  onIndexChange?: (index: number) => void;
  /** Allow dragging / swiping with a pointer. */
  draggable?: boolean;
}

/**
 * A dependency-free carousel built on Motion: drag or swipe with momentum and
 * snap-to-slide springs, Previous / Next buttons, dots, arrow keys, an
 * endless loop and autoplay that pauses on hover, focus and reduced motion.
 *
 * Compose it like shadcn's: Carousel › CarouselContent › CarouselItem, plus
 * CarouselPrevious, CarouselNext, CarouselDots and CarouselPlayToggle. Size
 * slides with `basis-*` classes on CarouselItem and gaps with `gap-*` on
 * CarouselContent. The track moves through a motion value, so dragging and
 * animating never re-render React.
 */
export function Carousel({
  loop = false,
  align = "start",
  autoplay = false,
  defaultIndex = 0,
  onIndexChange,
  draggable = true,
  className,
  children,
  onKeyDown,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  "aria-label": ariaLabel = "Carousel",
  ...props
}: CarouselProps) {
  const trackId = React.useId();
  const hydrated = useHydrated();
  const reduceMotion = useReducedMotion() ?? false;
  const reduced = hydrated && reduceMotion;

  const x = useMotionValue(0);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const slidesRef = React.useRef(new Map<number, SlideRegistration>());
  const animationRef = React.useRef<AnimationPlaybackControls | null>(null);

  const [slideCount, setSlideCount] = React.useState(0);
  const [metrics, setMetrics] = React.useState<Metrics | null>(null);
  const [selected, setSelected] = React.useState(defaultIndex);
  const [announcement, setAnnouncement] = React.useState("");

  const loopActive =
    loop && !!metrics && slideCount > 1 && metrics.length - Math.max(...metrics.widths) >= metrics.viewport;
  const { targets, slideToSnap } = React.useMemo(
    () => computeSnaps(metrics, align, loopActive, slideCount),
    [metrics, align, loopActive, slideCount]
  );
  const snapCount = targets.length;
  const current = Math.min(Math.max(0, selected), Math.max(0, snapCount - 1));

  // Everything the per-frame code needs, readable without re-subscribing.
  const live = React.useRef({ metrics, align, loopActive, targets, current, reduced });
  React.useLayoutEffect(() => {
    live.current = { metrics, align, loopActive, targets, current, reduced };
  });

  /* ------------------------------ per-frame ------------------------------ */

  const updateSlides = React.useCallback((value: number) => {
    const { metrics: m, align: a, loopActive: looping } = live.current;
    if (!m) return;
    slidesRef.current.forEach((slide, i) => {
      const width = m.widths[i];
      if (width === undefined) return;
      const base = m.offsets[i] + value;
      // In a loop each slide jumps a whole lap ahead or behind while it's out of view.
      const shift = looping ? mod(base + width, m.length) - width - base : 0;
      slide.shift.set(shift);
      const anchor = a === "start" ? 0 : (m.viewport - width) / 2;
      slide.progress.set((base + shift - anchor) / (width + m.gap || 1));
    });
  }, []);

  useMotionValueEvent(x, "change", updateSlides);

  const register = React.useCallback(
    (index: number, slide: SlideRegistration) => {
      slidesRef.current.set(index, slide);
      updateSlides(x.get());
      return () => {
        if (slidesRef.current.get(index) === slide) slidesRef.current.delete(index);
      };
    },
    [updateSlides, x]
  );

  /* ------------------------------ measuring ------------------------------ */

  React.useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const measure = () => {
      const slides = Array.from(track.children) as HTMLElement[];
      if (slides.length === 0) return setMetrics(null);
      const first = slides[0].offsetLeft;
      const offsets = slides.map((s) => s.offsetLeft - first);
      const widths = slides.map((s) => s.offsetWidth);
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const length = offsets[offsets.length - 1] + widths[widths.length - 1] + gap;
      const next: Metrics = { viewport: viewport.clientWidth, offsets, widths, gap, length };
      setMetrics((prev) =>
        prev &&
        prev.viewport === next.viewport &&
        prev.gap === next.gap &&
        prev.offsets.join() === next.offsets.join() &&
        prev.widths.join() === next.widths.join()
          ? prev
          : next
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    Array.from(track.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [slideCount]);

  // When the layout changes, jump (no animation) to the selected snap.
  React.useLayoutEffect(() => {
    if (!metrics || targets.length === 0) return;
    let target = targets[current];
    if (loopActive) target += Math.round((x.get() - target) / metrics.length) * metrics.length;
    animationRef.current?.stop();
    x.jump(target);
    updateSlides(target);
    // Only on layout changes — navigation animates on its own.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metrics, targets, loopActive]);

  /* ------------------------------ navigation ----------------------------- */

  const animateTo = React.useCallback(
    (target: number, velocity = 0) => {
      animationRef.current?.stop();
      if (live.current.reduced) {
        x.jump(target);
        return;
      }
      animationRef.current = animate(x, target, { ...slideSpring, velocity });
    },
    [x]
  );

  const select = React.useCallback(
    (snap: number, announce: boolean) => {
      setSelected(snap);
      if (snap !== live.current.current) onIndexChange?.(snap);
      if (announce) setAnnouncement(`Slide ${snap + 1} of ${live.current.targets.length}`);
    },
    [onIndexChange]
  );

  /** Go to a snap. `direction` forces the way round in a loop (1 = forward). */
  const goToSnap = React.useCallback(
    (snap: number, { direction = 0, velocity = 0, announce = true } = {}) => {
      const { metrics: m, targets: t, loopActive: looping } = live.current;
      if (t.length === 0) return;
      const index = looping ? mod(snap, t.length) : Math.min(Math.max(0, snap), t.length - 1);
      let target = t[index];
      if (looping && m) {
        const distance = (x.get() - target) / m.length;
        const k =
          direction > 0 ? Math.ceil(distance) - 1 : direction < 0 ? Math.floor(distance) + 1 : Math.round(distance);
        target += k * m.length;
      }
      select(index, announce);
      animateTo(target, velocity);
    },
    [animateTo, select, x]
  );

  const canStep = snapCount > 1;
  const canPrev = canStep && (loop || current > 0);
  const canNext = canStep && (loop || current < snapCount - 1);

  const step = React.useCallback(
    (dir: 1 | -1, { rewind = loop, announce = true } = {}) => {
      const { targets: t, current: c, loopActive: looping } = live.current;
      if (t.length < 2) return;
      let nextSnap = c + dir;
      if (!looping) {
        if (nextSnap < 0) nextSnap = rewind ? t.length - 1 : 0;
        else if (nextSnap > t.length - 1) nextSnap = rewind ? 0 : t.length - 1;
      }
      if (nextSnap === c) return;
      goToSnap(nextSnap, { direction: looping ? dir : 0, announce });
    },
    [goToSnap, loop]
  );

  const prev = React.useCallback(() => step(-1), [step]);
  const next = React.useCallback(() => step(1), [step]);
  const goTo = React.useCallback((snap: number) => goToSnap(snap), [goToSnap]);

  /* -------------------------------- drag --------------------------------- */

  const [dragging, setDragging] = React.useState(false);

  const onDragStart = React.useCallback(() => {
    animationRef.current?.stop();
    setDragging(true);
  }, []);

  const onDragEnd = React.useCallback(
    (info: PanInfo) => {
      setDragging(false);
      const { metrics: m, targets: t, loopActive: looping, current: c } = live.current;
      if (!m || t.length === 0) return;
      const velocity = info.velocity.x;
      const position = x.get();
      // Momentum: aim where the flick would carry the track.
      const projected = position + velocity * 0.22;

      let best = c;
      let bestTarget = t[c];
      let bestDistance = Infinity;
      t.forEach((target, i) => {
        const candidate = looping ? target + Math.round((projected - target) / m.length) * m.length : target;
        const distance = Math.abs(candidate - projected);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
          bestTarget = candidate;
        }
      });

      // A short, quick flick still moves one slide.
      if (best === c && Math.abs(velocity) > 350 && Math.abs(info.offset.x) > 10) {
        const dir = velocity < 0 ? 1 : -1;
        if (looping || (c + dir >= 0 && c + dir < t.length)) {
          goToSnap(c + dir, { direction: looping ? dir : 0, velocity });
          return;
        }
      }
      select(best, true);
      animateTo(bestTarget, velocity);
    },
    [animateTo, goToSnap, select, x]
  );

  const dragConstraints = React.useMemo(() => {
    if (loopActive || targets.length === 0) return false as const;
    return { left: Math.min(...targets), right: Math.max(...targets) };
  }, [loopActive, targets]);

  /* ------------------------------ focus --------------------------------- */

  const onSlideFocus = React.useCallback(
    (index: number, target: HTMLElement) => {
      // Only keyboard focus scrolls; a click on a slide shouldn't fight a drag.
      if (!target.matches(":focus-visible")) return;
      const m = live.current.metrics;
      const slide = slidesRef.current.get(index);
      if (!m || !slide) return;
      const left = m.offsets[index] + x.get() + slide.shift.get();
      const fullyVisible = left >= -1 && left + m.widths[index] <= m.viewport + 1;
      if (!fullyVisible) goToSnap(slideToSnap[index] ?? index);
    },
    [goToSnap, slideToSnap, x]
  );

  /* ------------------------------ autoplay ------------------------------- */

  const interval = autoplay === true ? 5000 : typeof autoplay === "number" ? autoplay : 0;
  const [playing, setPlaying] = React.useState(interval > 0);
  const [userStarted, setUserStarted] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [keyboardFocus, setKeyboardFocus] = React.useState(false);
  const [pageHidden, setPageHidden] = React.useState(false);

  // Reduced motion: no autoplay unless the user explicitly presses play.
  const effectivePlaying = interval > 0 && playing && (!reduced || userStarted);
  const running = effectivePlaying && !hovered && !keyboardFocus && !dragging && !pageHidden && snapCount > 1;

  React.useEffect(() => {
    if (interval <= 0) return;
    const onVisibility = () => setPageHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [interval]);

  React.useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => step(1, { rewind: true, announce: false }), interval);
    return () => window.clearTimeout(id);
  }, [running, interval, current, step]);

  const togglePlaying = React.useCallback(() => {
    setUserStarted(true);
    setPlaying(!effectivePlaying);
  }, [effectivePlaying]);

  /* ------------------------------ handlers ------------------------------- */

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const target = event.target as HTMLElement;
    if (target.closest("input, textarea, select, [contenteditable=''], [contenteditable='true']")) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    }
  };

  const context: CarouselContextValue = {
    x,
    viewportRef,
    trackRef,
    trackId,
    selected: current,
    snapCount,
    slideToSnap,
    canPrev,
    canNext,
    canDrag: draggable && snapCount > 1,
    dragConstraints,
    autoplayEnabled: interval > 0,
    playing: effectivePlaying,
    running,
    prev,
    next,
    goTo,
    togglePlaying,
    register,
    setSlideCount,
    onDragStart,
    onDragEnd,
    onSlideFocus,
  };

  return (
    <CarouselContext.Provider value={context}>
      <div
        ref={rootRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        data-slot="carousel"
        data-playing={running || undefined}
        className={cn("relative", className)}
        onKeyDown={handleKeyDown}
        onPointerEnter={(event) => {
          onPointerEnter?.(event);
          if (event.pointerType === "mouse") setHovered(true);
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event);
          setHovered(false);
        }}
        onFocus={(event) => {
          onFocus?.(event);
          const target = event.target as HTMLElement;
          setKeyboardFocus(target.matches(":focus-visible") && !target.closest("[data-carousel-toggle]"));
        }}
        onBlur={(event) => {
          onBlur?.(event);
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setKeyboardFocus(false);
        }}
        {...props}
      >
        {children}
        <span className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </span>
      </div>
    </CarouselContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Content                                   */
/* -------------------------------------------------------------------------- */

export interface CarouselContentProps
  extends Omit<
    React.ComponentProps<"div">,
    "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "style"
  > {
  /** Classes for the clipping viewport around the track. */
  viewportClassName?: string;
}

/** The clipping viewport and the draggable track. Put CarouselItems directly inside. */
export function CarouselContent({ className, viewportClassName, children, ...props }: CarouselContentProps) {
  const { x, viewportRef, trackRef, trackId, canDrag, dragConstraints, setSlideCount, onDragStart, onDragEnd } =
    useCarouselContext();
  const slides = React.Children.toArray(children).filter(React.isValidElement);
  const count = slides.length;
  const moved = React.useRef(false);

  React.useLayoutEffect(() => {
    setSlideCount(count);
  }, [count, setSlideCount]);

  // Stop the browser's native image / link dragging from hijacking a swipe.
  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const prevent = (event: DragEvent) => event.preventDefault();
    track.addEventListener("dragstart", prevent);
    return () => track.removeEventListener("dragstart", prevent);
  }, [trackRef]);

  return (
    // overflow: clip (not hidden) so focusing an off-screen slide can't scroll the viewport.
    <div ref={viewportRef} data-slot="carousel-viewport" className={cn("overflow-clip", viewportClassName)}>
      <motion.div
        ref={trackRef}
        id={trackId}
        data-slot="carousel-content"
        className={cn(
          "relative flex gap-4 touch-pan-y select-none",
          canDrag && "cursor-grab active:cursor-grabbing",
          className
        )}
        style={{ x }}
        drag={canDrag ? "x" : false}
        dragConstraints={dragConstraints}
        dragElastic={0.16}
        dragMomentum={false}
        onPointerDownCapture={() => {
          moved.current = false;
        }}
        onDragStart={onDragStart}
        onDrag={(_, info) => {
          if (Math.abs(info.offset.x) > 6) moved.current = true;
        }}
        onDragEnd={(_, info) => onDragEnd(info)}
        onClickCapture={(event) => {
          // A drag that ends over a link or button must not click it.
          if (!moved.current) return;
          moved.current = false;
          event.preventDefault();
          event.stopPropagation();
        }}
        {...props}
      >
        {slides.map((child, index) => (
          <SlideContext.Provider key={child.key ?? index} value={{ index, count }}>
            {child}
          </SlideContext.Provider>
        ))}
      </motion.div>
    </div>
  );
}

export interface CarouselItemProps
  extends Omit<
    React.ComponentProps<"div">,
    "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "style"
  > {
  style?: React.ComponentProps<typeof motion.div>["style"];
}

/** A slide. Full width by default; use `basis-1/2`, `basis-1/3`… to show several. */
export function CarouselItem({ className, style, onFocus, children, ...props }: CarouselItemProps) {
  const { register, onSlideFocus } = useCarouselContext();
  const slide = React.useContext(SlideContext);
  if (!slide) throw new Error("CarouselItem must be a direct child of <CarouselContent>.");
  const { index, count } = slide;

  const shift = useMotionValue(0);
  const progress = useMotionValue(0);
  const motionValues = React.useMemo(() => ({ shift, progress }), [shift, progress]);

  React.useLayoutEffect(() => register(index, motionValues), [register, index, motionValues]);

  return (
    <SlideMotionContext.Provider value={motionValues}>
      <motion.div
        role="group"
        aria-roledescription="slide"
        aria-label={`${index + 1} of ${count}`}
        data-slot="carousel-item"
        className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
        style={{ ...style, x: shift }}
        onFocus={(event: React.FocusEvent<HTMLDivElement>) => {
          onFocus?.(event);
          onSlideFocus(index, event.target as HTMLElement);
        }}
        {...props}
      >
        {children}
      </motion.div>
    </SlideMotionContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Controls                                  */
/* -------------------------------------------------------------------------- */

type ControlProps = Omit<React.ComponentProps<typeof Button>, "onClick"> & {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

/** Goes to the previous slide. Stays focusable (aria-disabled) at the start. */
export function CarouselPrevious({ className, variant = "outline", size = "icon", children, onClick, ...props }: ControlProps) {
  const { canPrev, prev, trackId } = useCarouselContext();
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      data-slot="carousel-previous"
      aria-label="Previous slide"
      aria-controls={trackId}
      aria-disabled={!canPrev || undefined}
      className={cn("rounded-full aria-disabled:pointer-events-none aria-disabled:opacity-40", className)}
      onClick={(event) => {
        onClick?.(event);
        if (canPrev && !event.defaultPrevented) prev();
      }}
      {...props}
    >
      {children ?? <ChevronLeft />}
    </Button>
  );
}

/** Goes to the next slide. Stays focusable (aria-disabled) at the end. */
export function CarouselNext({ className, variant = "outline", size = "icon", children, onClick, ...props }: ControlProps) {
  const { canNext, next, trackId } = useCarouselContext();
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      data-slot="carousel-next"
      aria-label="Next slide"
      aria-controls={trackId}
      aria-disabled={!canNext || undefined}
      className={cn("rounded-full aria-disabled:pointer-events-none aria-disabled:opacity-40", className)}
      onClick={(event) => {
        onClick?.(event);
        if (canNext && !event.defaultPrevented) next();
      }}
      {...props}
    >
      {children ?? <ChevronRight />}
    </Button>
  );
}

/** One dot per snap. A mint pill glides to the selected one. Hidden when everything fits. */
export function CarouselDots({ className, ...props }: React.ComponentProps<"div">) {
  const { snapCount, selected, goTo, trackId } = useCarouselContext();
  const layoutId = React.useId();
  return (
    <div
      role="group"
      aria-label="Choose slide"
      data-slot="carousel-dots"
      className={cn("flex h-6 items-center justify-center", className)}
      {...props}
    >
      <LayoutGroup id={layoutId}>
        {snapCount > 1 &&
          Array.from({ length: snapCount }, (_, i) => {
            const active = i === selected;
            return (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-controls={trackId}
                aria-current={active ? "true" : undefined}
                onClick={() => goTo(i)}
                className="group/dot relative grid h-6 w-5 place-items-center rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <span className="size-1.5 rounded-full bg-white/25 transition-colors duration-200 group-hover/dot:bg-white/50" />
                {active && (
                  <motion.span
                    layoutId="carousel-dot"
                    aria-hidden
                    transition={{ type: "spring", bounce: 0.25, duration: 0.45 }}
                    className="absolute h-1.5 w-3.5 rounded-full bg-primary shadow-[0_0_10px_var(--color-primary)]"
                  />
                )}
              </button>
            );
          })}
      </LayoutGroup>
    </div>
  );
}

/** Pause / resume autoplay. Renders nothing when autoplay is off. Required by WCAG 2.2.2 for auto-advancing content. */
export function CarouselPlayToggle({ className, variant = "ghost", size = "icon-sm", onClick, ...props }: ControlProps) {
  const { autoplayEnabled, playing, togglePlaying, trackId } = useCarouselContext();
  if (!autoplayEnabled) return null;
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      data-carousel-toggle
      data-slot="carousel-play-toggle"
      aria-label={playing ? "Pause automatic slide show" : "Start automatic slide show"}
      aria-controls={trackId}
      className={cn("rounded-full", className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) togglePlaying();
      }}
      {...props}
    >
      {playing ? <Pause /> : <Play />}
    </Button>
  );
}
