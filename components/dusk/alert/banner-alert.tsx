"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CircleAlert, CircleCheck, Info, Megaphone, TriangleAlert, X } from "lucide-react";

import { cn } from "@/lib/utils";

type BannerVariant = "default" | "info" | "success" | "warning" | "destructive";

const variantStyles: Record<BannerVariant, { surface: string; icon: string }> = {
  default: {
    surface: "border-white/10 bg-card",
    icon: "bg-white/10 text-foreground",
  },
  info: {
    surface: "border-sky-400/20 bg-sky-950/60",
    icon: "bg-sky-400/15 text-sky-300",
  },
  success: {
    surface: "border-emerald-400/20 bg-emerald-950/60",
    icon: "bg-emerald-400/15 text-emerald-300",
  },
  warning: {
    surface: "border-amber-400/20 bg-amber-950/60",
    icon: "bg-amber-400/15 text-amber-300",
  },
  destructive: {
    surface: "border-destructive/30 bg-red-950/60",
    icon: "bg-destructive/20 text-red-300",
  },
};

const defaultIcons: Record<BannerVariant, React.ReactNode> = {
  default: <Megaphone />,
  info: <Info />,
  success: <CircleCheck />,
  warning: <TriangleAlert />,
  destructive: <CircleAlert />,
};

export interface BannerAlertProps
  extends Omit<React.ComponentProps<"section">, "children" | "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd"> {
  /** The announcement text. Keep it to one line on desktop. */
  children: React.ReactNode;
  variant?: BannerVariant;
  /** Leading icon. Defaults to one matching the variant; pass `null` to hide it. */
  icon?: React.ReactNode;
  /** A call to action after the text, e.g. a link. */
  action?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Show the close button. */
  dismissible?: boolean;
  dismissLabel?: string;
  /**
   * Remember the dismissal in localStorage under this key, so the banner stays
   * closed on later visits. Change the key to show a new announcement.
   */
  storageKey?: string;
  /** Slide in after mount instead of rendering open. */
  animateOnMount?: boolean;
  /** Seconds to wait before sliding in. */
  delay?: number;
  /** Accessible name of the region. */
  label?: string;
}

const slide = { type: "spring", duration: 0.4, bounce: 0 } as const;

/**
 * A full-width announcement bar for the top of a page or app shell. It slides
 * down from above while its height grows, so the page eases down instead of
 * jumping. Dismissing slides it
 * back up. Pass `storageKey` to remember the dismissal across visits; the
 * stored value is read after hydration, so server and client HTML always match.
 * Renders a labelled <section> (not role="alert"), so it never interrupts
 * screen readers.
 */
export function BannerAlert({
  children,
  variant = "default",
  icon,
  action,
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  dismissible = true,
  dismissLabel = "Dismiss announcement",
  storageKey,
  animateOnMount = true,
  delay = 0.2,
  label = "Announcement",
  className,
  ...props
}: BannerAlertProps) {
  const reduceMotion = useReducedMotion();
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const storedDismissed = useStoredDismissal(storageKey);
  const open = (openProp ?? internalOpen) && !storedDismissed;
  const styles = variantStyles[variant];
  const shownIcon = icon === undefined ? defaultIcons[variant] : icon;

  const dismiss = () => {
    if (storageKey) writeDismissal(storageKey);
    if (openProp === undefined) setInternalOpen(false);
    onOpenChange?.(false);
  };

  return (
    <AnimatePresence initial={animateOnMount}>
      {open && (
        <motion.div
          key="banner"
          className="overflow-hidden"
          initial={{ height: 0 }}
          animate={{ height: "auto", transition: reduceMotion ? { duration: 0.2, delay } : { ...slide, delay } }}
          exit={{ height: 0 }}
          transition={reduceMotion ? { duration: 0.2 } : slide}
        >
          <motion.section
            aria-label={label}
            data-slot="banner-alert"
            data-variant={variant}
            className={cn(
              "relative flex min-h-11 items-center gap-3 overflow-hidden border-b px-4 py-2 text-sm text-foreground sm:justify-center sm:px-12",
              styles.surface,
              className
            )}
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { ...slide, delay } }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={slide}
            {...props}
          >
            {shownIcon && (
              <span
                aria-hidden
                className={cn("grid size-6 shrink-0 place-items-center rounded-full [&_svg]:size-3.5", styles.icon)}
              >
                {shownIcon}
              </span>
            )}
            <p className="min-w-0 leading-snug text-pretty">
              {children}
              {action && <span className="ml-2 inline-flex align-baseline">{action}</span>}
            </p>
            {dismissible && (
              <button
                type="button"
                aria-label={dismissLabel}
                onClick={dismiss}
                className={cn(
                  "ml-auto inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none sm:absolute sm:top-1/2 sm:right-3 sm:-translate-y-1/2",
                  "transition-[color,background-color,box-shadow] duration-150 hover:bg-white/10 hover:text-foreground",
                  "focus-visible:ring-[3px] focus-visible:ring-ring/50"
                )}
              >
                <X className="size-4" aria-hidden />
              </button>
            )}
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---- Dismissal persistence (localStorage, hydration-safe via useSyncExternalStore) ----

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function readDismissal(key: string) {
  try {
    return window.localStorage.getItem(key) === "dismissed";
  } catch {
    return false;
  }
}

function writeDismissal(key: string) {
  try {
    window.localStorage.setItem(key, "dismissed");
  } catch {
    // Storage can be unavailable (private mode, quotas). The banner still closes for this visit.
  }
  listeners.forEach((listener) => listener());
}

/** Whether `key` was dismissed before. Always `false` on the server and during hydration. */
function useStoredDismissal(key: string | undefined) {
  return React.useSyncExternalStore(
    subscribe,
    () => (key ? readDismissal(key) : false),
    () => false
  );
}
