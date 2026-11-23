"use client";

import * as React from "react";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { Bell, Info, TriangleAlert, X } from "lucide-react";
import { toast, type ExternalToast } from "sonner";

import { cn } from "@/lib/utils";

export type ToastStatus = "default" | "loading" | "success" | "error" | "info" | "warning";

const tone: Record<ToastStatus, { icon: string; border: string; bar: string }> = {
  default: { icon: "bg-white/10 text-foreground", border: "border-border", bar: "bg-foreground/40" },
  loading: { icon: "bg-primary/10 text-primary", border: "border-border", bar: "bg-primary" },
  success: { icon: "bg-primary/15 text-primary", border: "border-primary/25", bar: "bg-primary" },
  error: { icon: "bg-destructive/15 text-destructive", border: "border-destructive/30", bar: "bg-destructive" },
  info: { icon: "bg-sky-400/15 text-sky-300", border: "border-sky-400/20", bar: "bg-sky-400" },
  warning: { icon: "bg-amber-400/15 text-amber-300", border: "border-amber-400/20", bar: "bg-amber-400" },
};

// ---------------------------------------------------------------------------
// Countdown shared by DuskUI custom toasts
// ---------------------------------------------------------------------------

/**
 * Drives a toast's lifetime with a motion value (1 → 0) so the progress UI and
 * the dismissal can never drift apart. Like Sonner, it pauses while the
 * pointer is over the toaster, while the toast has keyboard focus and while
 * the tab is hidden. `onDone` runs once when it reaches 0.
 */
export function useToastCountdown(
  ref: React.RefObject<HTMLElement | null>,
  {
    duration,
    enabled = true,
    restartKey,
    onDone,
  }: {
    duration: number;
    enabled?: boolean;
    /** Restart the countdown from full whenever this changes. */
    restartKey?: string | number | boolean;
    onDone: () => void;
  }
): MotionValue<number> {
  const progress = useMotionValue(1);
  const done = React.useEffectEvent(() => onDone());

  React.useEffect(() => {
    const root = ref.current;
    if (!enabled || !root || !Number.isFinite(duration) || duration <= 0) {
      progress.jump(1);
      return;
    }
    const toaster = root.closest<HTMLElement>("[data-sonner-toaster]");
    const toastEl = root.closest<HTMLElement>("[data-sonner-toast]") ?? root;
    const reasons = new Set<"hover" | "focus" | "hidden">();

    progress.jump(1);
    const animation = animate(progress, 0, {
      duration: duration / 1000,
      ease: "linear",
      onComplete: () => done(),
    });

    const sync = () => (reasons.size ? animation.pause() : animation.play());
    const set = (reason: "hover" | "focus" | "hidden", on: boolean) => {
      if (on) reasons.add(reason);
      else reasons.delete(reason);
      sync();
    };
    const onEnter = () => set("hover", true);
    const onLeave = () => set("hover", false);
    const onFocusIn = () => set("focus", true);
    const onFocusOut = (event: FocusEvent) => {
      if (!toastEl.contains(event.relatedTarget as Node | null)) set("focus", false);
    };
    const onVisibility = () => set("hidden", document.hidden);

    if (toaster?.matches(":hover")) reasons.add("hover");
    if (toastEl.contains(document.activeElement)) reasons.add("focus");
    if (document.hidden) reasons.add("hidden");
    sync();

    toaster?.addEventListener("pointerenter", onEnter);
    toaster?.addEventListener("pointerleave", onLeave);
    toastEl.addEventListener("focusin", onFocusIn);
    toastEl.addEventListener("focusout", onFocusOut);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      animation.stop();
      toaster?.removeEventListener("pointerenter", onEnter);
      toaster?.removeEventListener("pointerleave", onLeave);
      toastEl.removeEventListener("focusin", onFocusIn);
      toastEl.removeEventListener("focusout", onFocusOut);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [ref, duration, enabled, restartKey, progress]);

  return progress;
}

/** The surface every DuskUI custom toast sits on. Matches the DuskUI Toaster's styled toasts. */
export function ToastSurface({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="toast-surface"
      className={cn(
        "relative flex w-(--width) items-start gap-3 overflow-hidden rounded-xl border bg-popover p-3.5 pr-10 font-sans text-sm text-popover-foreground max-[600px]:w-full",
        "shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_16px_40px_-12px_rgb(0_0_0/0.7),0_0_0_1px_rgb(0_0_0/0.25)]",
        "transition-[border-color] duration-300",
        // Collapsed stack: hide the content of toasts behind the front one, like Sonner's styled toasts.
        // (Height is left alone so Sonner can still measure the toast.)
        "[[data-sonner-toast][data-expanded=false][data-front=false]_&>*]:opacity-0",
        className
      )}
      {...props}
    />
  );
}

/** The round close button in the top-right corner of a custom toast. */
export function ToastClose({ className, label = "Close notification", ...props }: React.ComponentProps<"button"> & { label?: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "absolute top-2.5 right-2.5 inline-flex size-6 items-center justify-center rounded-md text-muted-foreground outline-none",
        "transition-[color,background-color,box-shadow] duration-150 hover:bg-accent hover:text-foreground",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className
      )}
      {...props}
    >
      <X className="size-3.5" aria-hidden />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Status icon that morphs between states
// ---------------------------------------------------------------------------

const draw = { type: "spring", duration: 0.5, bounce: 0 } as const;

function StatusGlyph({ status }: { status: ToastStatus }) {
  switch (status) {
    case "loading":
      return (
        <svg viewBox="0 0 24 24" className="size-4 animate-spin motion-reduce:animate-[spin_2.5s_linear_infinite]" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "success":
      return (
        <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
          <motion.path
            d="M5 12.5l4.5 4.5L19 7.5"
            stroke="currentColor"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ ...draw, delay: 0.08 }}
          />
        </svg>
      );
    case "error":
      return (
        <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
          {["M7 7l10 10", "M17 7L7 17"].map((d, index) => (
            <motion.path
              key={d}
              d={d}
              stroke="currentColor"
              strokeWidth="2.75"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ ...draw, delay: 0.08 + index * 0.1 }}
            />
          ))}
        </svg>
      );
    case "info":
      return <Info className="size-4" aria-hidden />;
    case "warning":
      return <TriangleAlert className="size-4" aria-hidden />;
    default:
      return <Bell className="size-4" aria-hidden />;
  }
}

/** A tinted circle whose glyph morphs (scale + rotate + path draw) when `status` changes. */
export function ToastStatusIcon({ status, className }: { status: ToastStatus; className?: string }) {
  const reduceMotion = useReducedMotion();
  const settled = status === "success" || status === "error";

  return (
    <span
      aria-hidden
      className={cn(
        "relative grid size-7 shrink-0 place-items-center rounded-full transition-colors duration-300",
        tone[status].icon,
        className
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={status}
          className="grid place-items-center"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.4, rotate: -60 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.4, rotate: 60 }}
          transition={{ type: "spring", duration: 0.45, bounce: 0.35 }}
        >
          <StatusGlyph status={status} />
        </motion.span>
      </AnimatePresence>
      {/* A one-off ripple when the toast lands on success or error. */}
      {settled && !reduceMotion && (
        <motion.span
          key={`ring-${status}`}
          className="absolute inset-0 rounded-full border border-current"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.9, opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// The toast
// ---------------------------------------------------------------------------

export interface ToastAction {
  label: React.ReactNode;
  /** Call `event.preventDefault()` to keep the toast open. */
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface AnimatedToastProps {
  /** The Sonner toast id (from `toast.custom`). */
  id: string | number;
  status?: ToastStatus;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Lifetime in ms after it settles. `Infinity` keeps it open. Ignored while loading. */
  duration?: number;
  action?: ToastAction;
  /** Show the close button. */
  dismissible?: boolean;
  onAutoClose?: () => void;
  onDismiss?: () => void;
}

/**
 * A custom Sonner toast. Its icon morphs between loading, success and error
 * (the spinner spins out, the check or cross draws itself in), a thin line
 * along the bottom shows the time left, and the title crossfades on change.
 * Render it with `toast.custom`, or use the `animatedToast` helpers below.
 */
export function AnimatedToast({
  id,
  status = "default",
  title,
  description,
  duration = 5000,
  action,
  dismissible = true,
  onAutoClose,
  onDismiss,
}: AnimatedToastProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const timed = status !== "loading" && Number.isFinite(duration) && duration > 0;
  const progress = useToastCountdown(ref, {
    duration,
    enabled: timed,
    onDone: () => {
      onAutoClose?.();
      toast.dismiss(id);
    },
  });

  return (
    <ToastSurface ref={ref} data-status={status} aria-busy={status === "loading" || undefined} className={tone[status].border}>
      <ToastStatusIcon status={status} />
      <div className="grid min-w-0 flex-1 gap-0.5 pt-1">
        <motion.p
          key={`${status}-title`}
          className="leading-snug font-medium"
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {title}
        </motion.p>
        {description && <p className="text-[0.8125rem] leading-snug text-muted-foreground">{description}</p>}
        {action && (
          <div className="mt-2 flex">
            <button
              type="button"
              className={cn(
                "inline-flex h-7 items-center rounded-md bg-primary/10 px-2.5 text-xs font-medium text-primary outline-none",
                "transition-[background-color,box-shadow] duration-150 hover:bg-primary/20 focus-visible:ring-[3px] focus-visible:ring-ring/50"
              )}
              onClick={(event) => {
                action.onClick(event);
                if (!event.defaultPrevented) toast.dismiss(id);
              }}
            >
              {action.label}
            </button>
          </div>
        )}
      </div>
      {dismissible && status !== "loading" && (
        <ToastClose
          onClick={() => {
            onDismiss?.();
            toast.dismiss(id);
          }}
        />
      )}
      {timed && (
        <motion.span
          aria-hidden
          className={cn("absolute inset-x-0 bottom-0 h-0.5 origin-left opacity-70", tone[status].bar)}
          style={{ scaleX: progress }}
        />
      )}
    </ToastSurface>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export interface AnimatedToastOptions
  extends Pick<AnimatedToastProps, "description" | "duration" | "action" | "dismissible" | "onAutoClose" | "onDismiss">,
    Pick<ExternalToast, "position" | "className"> {
  /** Reuse an id to update an existing toast in place (its icon morphs). */
  id?: string | number;
}

function show(status: ToastStatus, title: React.ReactNode, { id, position, className, ...options }: AnimatedToastOptions = {}) {
  return toast.custom(
    (toastId) => <AnimatedToast id={toastId} status={status} title={title} {...options} />,
    {
      id,
      position,
      className,
      // We run our own timer so the progress line and the dismissal stay in sync.
      duration: Infinity,
      dismissible: status !== "loading" && options.dismissible !== false,
      onDismiss: options.onDismiss,
    }
  );
}

type Message = React.ReactNode | { title: React.ReactNode; description?: React.ReactNode };

function toParts(message: Message) {
  if (message && typeof message === "object" && !React.isValidElement(message) && "title" in message) {
    return message;
  }
  return { title: message as React.ReactNode, description: undefined };
}

export interface PromiseToastMessages<T> {
  loading: Message;
  success: Message | ((data: T) => Message);
  error: Message | ((error: unknown) => Message);
}

export interface PromiseToastOptions extends Omit<AnimatedToastOptions, "description" | "action"> {
  /** Keep the spinner up at least this long (ms) so fast requests don't flash. */
  minLoading?: number;
  /** Label of the retry button shown on error. Only when you pass a function (it is called again). Set `false` to hide. */
  retryLabel?: React.ReactNode | false;
}

let counter = 0;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * One toast that follows a promise: a spinner while it runs, then the icon
 * morphs into a check or a cross. Pass a function instead of a promise to get
 * a Retry button on failure that re-runs it in the same toast.
 * Returns `{ id, unwrap }`; `unwrap()` resolves or rejects with the first attempt.
 */
function promise<T>(
  task: Promise<T> | (() => Promise<T>),
  messages: PromiseToastMessages<T>,
  { id = `dusk-toast-${++counter}`, minLoading = 600, retryLabel = "Retry", ...options }: PromiseToastOptions = {}
) {
  const run = (): Promise<T> => {
    show("loading", toParts(messages.loading).title, { ...options, id, description: toParts(messages.loading).description });
    const started = Date.now();
    const settle = () => wait(Math.max(0, minLoading - (Date.now() - started)));
    const pending = typeof task === "function" ? task() : task;

    return pending.then(
      async (data) => {
        await settle();
        const message = toParts(typeof messages.success === "function" ? messages.success(data) : messages.success);
        show("success", message.title, { ...options, id, description: message.description });
        return data;
      },
      async (error: unknown) => {
        await settle();
        const message = toParts(typeof messages.error === "function" ? messages.error(error) : messages.error);
        const canRetry = typeof task === "function" && retryLabel !== false;
        show("error", message.title, {
          ...options,
          id,
          description: message.description,
          action: canRetry
            ? {
                label: retryLabel,
                onClick: (event) => {
                  event.preventDefault();
                  run().catch(() => {});
                },
              }
            : undefined,
        });
        throw error;
      }
    );
  };

  const result = run();
  // The toast reports the failure; callers who care use unwrap().
  result.catch(() => {});
  return { id, unwrap: () => result };
}

/**
 * Fire DuskUI animated toasts through the global Sonner Toaster.
 *
 * animatedToast("Saved")
 * animatedToast.success("Deployed", { description: "dusk-web is live" })
 * const id = animatedToast.loading("Uploading…")
 * animatedToast.success("Uploaded", { id })   // same toast, icon morphs
 * animatedToast.promise(() => save(), { loading: "Saving…", success: "Saved", error: "Couldn't save" })
 */
export const animatedToast = Object.assign(
  (title: React.ReactNode, options?: AnimatedToastOptions) => show("default", title, options),
  {
    success: (title: React.ReactNode, options?: AnimatedToastOptions) => show("success", title, options),
    error: (title: React.ReactNode, options?: AnimatedToastOptions) => show("error", title, options),
    info: (title: React.ReactNode, options?: AnimatedToastOptions) => show("info", title, options),
    warning: (title: React.ReactNode, options?: AnimatedToastOptions) => show("warning", title, options),
    loading: (title: React.ReactNode, options?: AnimatedToastOptions) => show("loading", title, options),
    promise,
    dismiss: (id?: string | number) => toast.dismiss(id),
  }
);
