"use client";

import * as React from "react";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "motion/react";
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react";

import { Alert, AlertAction, AlertDescription, AlertTitle, type AlertProps } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type Variant = NonNullable<AlertProps["variant"]>;

const defaultIcons: Record<Variant, React.ReactNode> = {
  default: <Info />,
  info: <Info />,
  success: <CircleCheck />,
  warning: <TriangleAlert />,
  destructive: <CircleAlert />,
};

// The auto-dismiss line takes the alert's text color.
const barColor: Record<Variant, string> = {
  default: "bg-primary",
  info: "bg-sky-400",
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  destructive: "bg-destructive",
};

export interface DismissibleAlertProps
  extends Omit<AlertProps, "title" | "children"> {
  title?: React.ReactNode;
  /** The alert's description. */
  children?: React.ReactNode;
  /** Leading icon. Defaults to one matching the variant; pass `null` to hide it. */
  icon?: React.ReactNode;
  /** Extra content under the description, e.g. buttons. */
  actions?: React.ReactNode;
  open?: boolean;
  /** Uncontrolled initial state. */
  defaultOpen?: boolean;
  /** Called with `false` when the alert is dismissed (button, Escape or timeout). */
  onOpenChange?: (open: boolean) => void;
  /** Called after the exit animation, once the alert is gone from the layout. */
  onExitComplete?: () => void;
  /** Dismiss on its own after this many ms, with a progress line along the bottom. Pauses on hover, focus and hidden tabs. */
  autoDismiss?: number;
  /** Show the close button. */
  dismissible?: boolean;
  /** Accessible label for the close button. */
  dismissLabel?: string;
}

const collapse = { type: "spring", duration: 0.4, bounce: 0 } as const;

/**
 * An Alert that can be closed. On dismiss it fades and blurs out while its
 * height (and margin) collapses, so the content below slides up instead of
 * jumping. With `autoDismiss` it closes itself after a delay and draws a
 * shrinking progress line; the countdown pauses while the alert is hovered or
 * focused and while the tab is hidden. Press Escape inside it to dismiss.
 * Urgent variants (destructive, warning) use role="alert", the rest
 * role="status", so screen readers only interrupt when it matters.
 */
export function DismissibleAlert({
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  onExitComplete,
  ...props
}: DismissibleAlertProps) {
  const reduceMotion = useReducedMotion();
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;

  const dismiss = () => {
    if (openProp === undefined) setInternalOpen(false);
    onOpenChange?.(false);
  };

  return (
    <AnimatePresence initial={false} onExitComplete={onExitComplete}>
      {open && (
        <motion.div
          key="alert"
          className="overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={reduceMotion ? { duration: 0.15 } : collapse}
        >
          <motion.div
            initial={reduceMotion ? false : { scale: 0.98, filter: "blur(4px)" }}
            animate={{ scale: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
            exit={reduceMotion ? undefined : { scale: 0.98, filter: "blur(4px)" }}
            transition={collapse}
          >
            <AlertSurface {...props} onDismiss={dismiss} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type AlertSurfaceProps = Omit<
  DismissibleAlertProps,
  "open" | "defaultOpen" | "onOpenChange" | "onExitComplete"
> & { onDismiss: () => void };

/** The visible alert. Mounted only while open, so the countdown state starts fresh every time. */
function AlertSurface({
  variant = "default",
  title,
  children,
  icon,
  actions,
  autoDismiss,
  dismissible = true,
  dismissLabel = "Dismiss",
  onDismiss,
  className,
  role,
  onKeyDown,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: AlertSurfaceProps) {
  const v = variant ?? "default";
  const shownIcon = icon === undefined ? defaultIcons[v] : icon;

  // A motion value drives both the timer and the progress line, so they can't drift apart.
  const progress = useMotionValue(1);
  const controls = React.useRef<AnimationPlaybackControls | null>(null);
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const tabHidden = useDocumentHidden();
  const paused = hovered || focused || tabHidden;

  const onTimeout = React.useEffectEvent(() => onDismiss());
  const isPaused = React.useEffectEvent(() => paused);

  React.useEffect(() => {
    if (!autoDismiss) return;
    progress.set(1);
    const animation = animate(progress, 0, {
      duration: autoDismiss / 1000,
      ease: "linear",
      onComplete: () => onTimeout(),
    });
    if (isPaused()) animation.pause();
    controls.current = animation;
    return () => {
      animation.stop();
      controls.current = null;
    };
  }, [autoDismiss, progress]);

  React.useEffect(() => {
    if (paused) controls.current?.pause();
    else controls.current?.play();
  }, [paused]);

  return (
    <Alert
      variant={variant}
      role={role ?? (v === "destructive" || v === "warning" ? "alert" : "status")}
      className={cn("overflow-hidden", className)}
      {...props}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        setHovered(true);
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        setHovered(false);
      }}
      onFocus={(event) => {
        onFocus?.(event);
        setFocused(true);
      }}
      onBlur={(event) => {
        onBlur?.(event);
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (dismissible && event.key === "Escape" && !event.defaultPrevented) onDismiss();
      }}
    >
      {shownIcon}
      {title && <AlertTitle>{title}</AlertTitle>}
      {children && <AlertDescription>{children}</AlertDescription>}
      {actions && <div className="col-start-2 mt-2 flex flex-wrap gap-2">{actions}</div>}
      {dismissible && (
        <AlertAction>
          <button
            type="button"
            aria-label={dismissLabel}
            onClick={onDismiss}
            className={cn(
              "inline-flex size-7 items-center justify-center rounded-md text-current opacity-70 outline-none",
              "transition-[opacity,background-color,box-shadow] duration-150 hover:bg-white/10 hover:opacity-100",
              "focus-visible:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/50"
            )}
          >
            <X className="size-4" aria-hidden />
          </button>
        </AlertAction>
      )}
      {autoDismiss ? (
        <motion.span
          aria-hidden
          data-slot="alert-progress"
          className={cn("absolute inset-x-0 bottom-0 h-0.5 origin-left opacity-60", barColor[v])}
          style={{ scaleX: progress }}
        />
      ) : null}
    </Alert>
  );
}

function subscribeVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

/** `true` while the tab is in the background. Always `false` on the server. */
function useDocumentHidden() {
  return React.useSyncExternalStore(
    subscribeVisibility,
    () => document.hidden,
    () => false
  );
}
