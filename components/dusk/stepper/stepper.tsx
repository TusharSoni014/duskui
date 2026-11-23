"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion, type Transition, type Variants } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Loader2, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fill: Transition = { type: "spring", stiffness: 120, damping: 22 };
const pop: Transition = { type: "spring", duration: 0.25, bounce: 0.1 };
const panelSpring: Transition = { type: "spring", bounce: 0, duration: 0.3 };

type ValidateResult = boolean | string | void;

export type StepperStepConfig = {
  /** Short step name shown next to the marker. */
  title: string;
  /** Optional second line. */
  description?: string;
  /**
   * Runs before moving forward from this step. Return `false` or an error
   * message to stay; may be async (the Next button shows a spinner meanwhile).
   */
  validate?: () => ValidateResult | Promise<ValidateResult>;
};

type Orientation = "horizontal" | "vertical";

type StepperContextValue = {
  steps: StepperStepConfig[];
  /** Index of the step on screen. */
  index: number;
  count: number;
  /** 1 when moving forward, -1 when moving back. */
  direction: number;
  /** True once the last step has been finished. */
  completed: boolean;
  /** Furthest step reached so far. */
  furthest: number;
  /** True while a step's validate() is running. */
  pending: boolean;
  /** Message from the last failed validation. */
  error: string | null;
  orientation: Orientation;
  isFirst: boolean;
  isLast: boolean;
  /** Validates the current step, then goes to the next one (or completes on the last). */
  next: () => Promise<void>;
  back: () => void;
  /** Jumps to a step. Forward jumps validate the current step first. */
  goTo: (index: number) => Promise<void>;
  canGoTo: (index: number) => boolean;
  /** Back to the first step, clearing completion. */
  reset: () => void;
  baseId: string;
  /** True once after the step changed through the UI, so the new panel takes focus. */
  takeFocusRequest: () => boolean;
};

const StepperContext = React.createContext<StepperContextValue | null>(null);

/** Read and drive the stepper from any child — handy for custom controls. */
export function useStepper() {
  const context = React.useContext(StepperContext);
  if (!context) throw new Error("useStepper must be used inside <Stepper>.");
  return context;
}

export interface StepperProps extends Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> {
  steps: StepperStepConfig[];
  /** Controlled step index. */
  value?: number;
  /** Starting step when uncontrolled. */
  defaultValue?: number;
  onValueChange?: (index: number) => void;
  /** Called after the last step validates. */
  onComplete?: () => void;
  /** Markers in a row above the panels, or a column beside them. */
  orientation?: Orientation;
  /** Only allow jumping to steps already reached. Set false to let people jump anywhere. */
  linear?: boolean;
}

/**
 * A multi-step flow that manages content panels and navigation, with an animated progress line, check marks that draw on completed steps, direction-aware panel slides and optional per-step validation.
 */
export function Stepper({
  steps,
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  onComplete,
  orientation = "horizontal",
  linear = true,
  className,
  children,
  ...props
}: StepperProps) {
  const baseId = React.useId();
  const count = steps.length;
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const index = Math.min(Math.max(0, valueProp ?? uncontrolled), count - 1);
  const [completed, setCompleted] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [announcement, setAnnouncement] = React.useState("");
  const [direction, setDirection] = React.useState(0);
  const [furthest, setFurthest] = React.useState(index);
  const [previous, setPrevious] = React.useState(index);
  const focusRequest = React.useRef(false);
  const mounted = React.useRef(true);

  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Works for both controlled and internal changes: derive travel direction from the index itself.
  if (previous !== index) {
    setPrevious(index);
    setDirection(Math.sign(index - previous));
    setFurthest((f) => Math.max(f, index));
  }

  const setIndex = (next: number) => {
    if (valueProp === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };

  const show = (next: number) => {
    setError(null);
    setCompleted(false);
    focusRequest.current = true;
    setIndex(next);
    setAnnouncement(`Step ${next + 1} of ${count}: ${steps[next].title}`);
  };

  const validateCurrent = async () => {
    const validate = steps[index]?.validate;
    if (!validate) return true;
    setError(null);
    setPending(true);
    let result: ValidateResult;
    try {
      result = await validate();
    } catch (err) {
      result = err instanceof Error ? err.message : false;
    }
    if (!mounted.current) return false;
    setPending(false);
    if (result === false || typeof result === "string") {
      const message = typeof result === "string" ? result : "Please complete this step before continuing.";
      setError(message);
      setAnnouncement(message);
      return false;
    }
    return true;
  };

  const canGoTo = (target: number) =>
    target >= 0 && target < count && (target <= index || completed || !linear || target <= furthest);

  const next = async () => {
    if (pending || completed) return;
    if (!(await validateCurrent())) return;
    if (index < count - 1) {
      show(index + 1);
      return;
    }
    setDirection(1);
    setCompleted(true);
    setFurthest(count);
    focusRequest.current = true;
    setAnnouncement("All steps complete.");
    onComplete?.();
  };

  const back = () => {
    if (pending) return;
    if (completed) {
      setDirection(-1);
      setCompleted(false);
      focusRequest.current = true;
      setAnnouncement(`Step ${index + 1} of ${count}: ${steps[index].title}`);
      return;
    }
    if (index > 0) show(index - 1);
  };

  const goTo = async (target: number) => {
    if (pending || !canGoTo(target)) return;
    if (target === index) {
      if (completed) back();
      return;
    }
    if (target > index && !completed && !(await validateCurrent())) return;
    show(target);
  };

  const reset = () => {
    setFurthest(0);
    setError(null);
    if (index === 0) {
      setDirection(-1);
      setCompleted(false);
      focusRequest.current = true;
      setAnnouncement(`Step 1 of ${count}: ${steps[0].title}`);
    } else {
      show(0);
    }
  };

  const context: StepperContextValue = {
    steps,
    index,
    count,
    direction,
    completed,
    furthest,
    pending,
    error,
    orientation,
    isFirst: index === 0,
    isLast: index === count - 1,
    next,
    back,
    goTo,
    canGoTo,
    reset,
    baseId,
    takeFocusRequest: () => {
      const requested = focusRequest.current;
      focusRequest.current = false;
      return requested;
    },
  };

  return (
    <StepperContext.Provider value={context}>
      <div
        data-slot="stepper"
        data-orientation={orientation}
        className={cn(
          "flex w-full gap-8",
          orientation === "horizontal" ? "flex-col" : "flex-col sm:flex-row sm:items-start",
          className
        )}
        {...props}
      >
        {children}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {announcement}
        </div>
      </div>
    </StepperContext.Provider>
  );
}

function CheckMark({ instant }: { instant: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <motion.path
        d="M5 12.5l4.5 4.5L19 7.5"
        initial={{ pathLength: instant ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={instant ? { duration: 0 } : { duration: 0.35, ease: "easeOut", delay: 0.1 }}
      />
    </svg>
  );
}

export interface StepperNavProps extends React.ComponentProps<"nav"> {
  /** Accessible name for the step list. */
  label?: string;
}

/** The step markers joined by a progress line. Reached steps are buttons you can jump back to. */
export function StepperNav({ label = "Steps", className, ...props }: StepperNavProps) {
  const { steps, index, completed, orientation, canGoTo, goTo, baseId } = useStepper();
  const reduceMotion = useReducedMotion() ?? false;
  const vertical = orientation === "vertical";
  const done = (i: number) => completed || i < index;

  return (
    <nav aria-label={label} className={cn(vertical ? "w-full sm:w-56 sm:shrink-0" : "w-full", className)} {...props}>
      <ol className={cn("flex", vertical ? "flex-col" : "w-full items-start")}>
        {steps.map((step, i) => {
          const state = done(i) ? "complete" : i === index ? "current" : "upcoming";
          const isLast = i === steps.length - 1;
          const navigable = canGoTo(i) && (i !== index || completed);
          return (
            <li
              key={`${step.title}-${i}`}
              data-state={state}
              className={cn(
                "relative flex min-w-0",
                vertical ? "gap-3 pb-7 last:pb-0" : "flex-1 basis-0 flex-col items-center text-center"
              )}
            >
              {!isLast && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute overflow-hidden rounded-full bg-muted",
                    vertical
                      ? "top-10 bottom-1.5 left-[calc(1rem-1px)] w-0.5"
                      : "top-4 left-[calc(50%+1.5rem)] h-0.5 w-[calc(100%-3rem)] -translate-y-1/2"
                  )}
                >
                  <motion.span
                    className={cn("block rounded-full bg-primary", vertical ? "h-full w-full origin-top" : "h-full w-full origin-left")}
                    initial={false}
                    animate={vertical ? { scaleY: done(i) ? 1 : 0 } : { scaleX: done(i) ? 1 : 0 }}
                    transition={reduceMotion ? { duration: 0 } : fill}
                  />
                </span>
              )}

              <button
                type="button"
                id={`${baseId}-step-${i}`}
                aria-current={state === "current" && !completed ? "step" : undefined}
                aria-disabled={!navigable || undefined}
                onClick={() => navigable && goTo(i)}
                className={cn(
                  "group/step flex min-w-0 rounded-lg text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                  vertical ? "items-start gap-3" : "flex-col items-center gap-2 px-1 text-center",
                  navigable ? "cursor-pointer" : "cursor-default"
                )}
              >
                <motion.span
                  aria-hidden
                  className={cn(
                    "relative grid size-8 shrink-0 place-items-center rounded-full border-2 text-xs font-semibold tabular-nums transition-colors duration-300",
                    state === "complete" && "border-primary bg-primary text-primary-foreground",
                    state === "current" && "border-primary bg-background text-primary",
                    state === "upcoming" && "border-border bg-background text-muted-foreground",
                    navigable && state === "upcoming" && "group-hover/step:border-muted-foreground"
                  )}
                >
                  <AnimatePresence initial={false} mode="popLayout">
                    {state === "complete" ? (
                      <motion.span
                        key="check"
                        initial={reduceMotion ? false : { scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.12 } }}
                        transition={pop}
                      >
                        <CheckMark instant={reduceMotion} />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="number"
                        initial={reduceMotion ? false : { scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.12 } }}
                        transition={pop}
                      >
                        {i + 1}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.span>
                <span className={cn("min-w-0", vertical ? "pt-1" : "max-w-32")}>
                  <span
                    className={cn(
                      "block truncate text-xs font-medium transition-colors duration-300 sm:text-sm",
                      state === "upcoming" ? "text-muted-foreground" : "text-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                  {step.description && (
                    <span className={cn("mt-0.5 truncate text-xs text-muted-foreground", vertical ? "block" : "hidden sm:block")}>
                      {step.description}
                    </span>
                  )}
                  <span className="sr-only">
                    {state === "complete" ? " (completed)" : state === "current" ? " (current step)" : " (not started)"}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Wraps the panels. Stacks them in one grid cell so outgoing and incoming
 * panels can cross, and springs its height to the active one.
 */
export function StepperPanels({ className, children, ...props }: React.ComponentProps<"div">) {
  const reduceMotion = useReducedMotion();
  const innerRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState<number | "auto">("auto");

  React.useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setHeight(entry.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      data-slot="stepper-panels"
      initial={false}
      animate={{ height }}
      transition={reduceMotion ? { duration: 0 } : panelSpring}
      className={cn("relative min-w-0 flex-1 overflow-hidden", className)}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      <div ref={innerRef} className="grid *:col-start-1 *:row-start-1">
        {children}
      </div>
    </motion.div>
  );
}

function AnimatedPanel({
  show,
  panelKey,
  ariaLabel,
  labelledBy,
  className,
  children,
}: {
  show: boolean;
  panelKey: string;
  ariaLabel?: string;
  labelledBy?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { direction, orientation, takeFocusRequest } = useStepper();
  const reduceMotion = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const distance = reduceMotion ? 0 : 12;
  const axis = orientation === "vertical" ? "y" : "x";

  React.useEffect(() => {
    if (show && takeFocusRequest()) ref.current?.focus({ preventScroll: true });
    // Only when this panel appears; takeFocusRequest changes identity every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const offset = (value: number) => (axis === "y" ? { x: 0, y: value } : { x: value, y: 0 });
  const variants: Variants = {
    enter: (dir: number) => ({ opacity: 0, ...offset(dir * distance) }),
    center: { opacity: 1, x: 0, y: 0 },
    exit: (dir: number) => ({ opacity: 0, ...offset(dir * -distance) }),
  };

  return (
    <AnimatePresence initial={false} custom={direction}>
      {show && (
        <motion.div
          key={panelKey}
          ref={ref}
          role="group"
          tabIndex={-1}
          aria-label={ariaLabel}
          aria-labelledby={labelledBy}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={panelSpring}
          className={cn("min-w-0 outline-none", className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export interface StepperPanelProps {
  /** Which step (0-based) this panel belongs to. */
  index: number;
  className?: string;
  children: React.ReactNode;
}

/** Content for one step. Slides in from the direction of travel and takes focus when reached. */
export function StepperPanel({ index, className, children }: StepperPanelProps) {
  const { index: active, completed, baseId } = useStepper();
  return (
    <AnimatedPanel
      show={!completed && active === index}
      panelKey={`step-${index}`}
      labelledBy={`${baseId}-step-${index}`}
      className={className}
    >
      {children}
    </AnimatedPanel>
  );
}

/** Shown in place of the panels once the last step is finished. */
export function StepperCompleted({ className, children }: { className?: string; children: React.ReactNode }) {
  const { completed } = useStepper();
  return (
    <AnimatedPanel show={completed} panelKey="completed" ariaLabel="Complete" className={className}>
      {children}
    </AnimatedPanel>
  );
}

export interface StepperControlsProps extends React.ComponentProps<"div"> {
  backLabel?: React.ReactNode;
  nextLabel?: React.ReactNode;
  completeLabel?: React.ReactNode;
  /** Label for the restart button shown after completion. `null` hides it. */
  restartLabel?: React.ReactNode | null;
}

/** Back / Next / Finish buttons wired to the stepper, with the validation error beside them. */
export function StepperControls({
  backLabel = "Back",
  nextLabel = "Continue",
  completeLabel = "Finish",
  restartLabel = "Start over",
  className,
  ...props
}: StepperControlsProps) {
  const { isFirst, isLast, next, back, reset, pending, error, completed } = useStepper();

  return (
    <div data-slot="stepper-controls" className={cn("flex flex-wrap items-center gap-3", className)} {...props}>
      {/* Announced through the stepper's live region, so no role="alert" here. */}
      <p className="min-h-5 flex-1 basis-40 text-sm text-destructive">
        {error}
      </p>
      <div className="ml-auto flex gap-2">
        {completed ? (
          restartLabel !== null && (
            <Button type="button" variant="outline" size="sm" onClick={reset}>
              <RotateCcw aria-hidden />
              {restartLabel}
            </Button>
          )
        ) : (
          <>
            <Button type="button" variant="outline" size="sm" onClick={back} disabled={isFirst} aria-disabled={pending || undefined}>
              <ArrowLeft aria-hidden />
              {backLabel}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => void next()}
              aria-busy={pending || undefined}
              aria-disabled={pending || undefined}
            >
              {isLast ? completeLabel : nextLabel}
              {pending ? (
                <Loader2 aria-hidden className="animate-spin motion-reduce:animate-none" />
              ) : isLast ? (
                <Check aria-hidden />
              ) : (
                <ArrowRight aria-hidden />
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
