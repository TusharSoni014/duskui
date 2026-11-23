"use client";

import * as React from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { Undo2 } from "lucide-react";
import { toast, type ExternalToast } from "sonner";

import {
  ToastClose,
  ToastStatusIcon,
  ToastSurface,
  useToastCountdown,
} from "@/components/dusk/toast/animated-toast";
import { cn } from "@/lib/utils";

export interface UndoToastOptions extends Pick<ExternalToast, "position" | "className"> {
  /** What just happened, e.g. "Email archived". */
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Restore what was removed. Runs at most once, and never after `onCommit`. */
  onUndo: () => void;
  /** Make the change permanent: runs once when the time runs out or the toast is closed without undoing. */
  onCommit?: () => void;
  /** How long the user has to undo, in ms. */
  duration?: number;
  undoLabel?: React.ReactNode;
  /** Title shown after undoing. */
  undoneTitle?: React.ReactNode;
  /** Also undo with ⌘Z / Ctrl+Z while the toast is up (ignored inside text fields). */
  shortcut?: boolean;
  id?: string | number;
}

const RADIUS = 11;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * The optimistic-delete pattern as a toast: remove the item from your UI
 * right away, call `undoToast()`, and only make the change permanent in
 * `onCommit`. A ring drains around the seconds left; Undo (or ⌘Z / Ctrl+Z)
 * calls `onUndo` and the toast morphs into a "Restored" confirmation. The
 * countdown pauses on hover, focus and hidden tabs, like any Sonner toast.
 * Returns the toast id.
 */
export function undoToast({
  title,
  description,
  onUndo,
  onCommit,
  duration = 6000,
  undoLabel = "Undo",
  undoneTitle = "Restored",
  shortcut = true,
  id,
  position,
  className,
}: UndoToastOptions) {
  let settled = false;
  const commit = () => {
    if (settled) return;
    settled = true;
    onCommit?.();
  };
  const undo = () => {
    if (settled) return false;
    settled = true;
    onUndo();
    return true;
  };

  return toast.custom(
    (toastId) => (
      <UndoToast
        id={toastId}
        title={title}
        description={description}
        duration={duration}
        undoLabel={undoLabel}
        undoneTitle={undoneTitle}
        shortcut={shortcut}
        onUndo={undo}
        onCommit={commit}
      />
    ),
    {
      id,
      position,
      className,
      duration: Infinity,
      // Swiping it away counts as "keep the change".
      onDismiss: commit,
    }
  );
}

interface UndoToastProps {
  id: string | number;
  title: React.ReactNode;
  description?: React.ReactNode;
  duration: number;
  undoLabel: React.ReactNode;
  undoneTitle: React.ReactNode;
  shortcut: boolean;
  /** Returns false if it was too late to undo. */
  onUndo: () => boolean;
  onCommit: () => void;
}

function UndoToast({ id, title, description, duration, undoLabel, undoneTitle, shortcut, onUndo, onCommit }: UndoToastProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [undone, setUndone] = React.useState(false);

  // Phase 1: the undo window. Phase 2 (after undoing): a short confirmation.
  const progress = useToastCountdown(ref, {
    duration: undone ? 2000 : duration,
    restartKey: undone,
    onDone: () => {
      if (!undone) onCommit();
      toast.dismiss(id);
    },
  });

  const handleUndo = React.useCallback(() => {
    if (onUndo()) setUndone(true);
  }, [onUndo]);

  React.useEffect(() => {
    if (!shortcut || undone) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "z" || !(event.metaKey || event.ctrlKey) || event.shiftKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable=''], [contenteditable='true']")) return;
      event.preventDefault();
      handleUndo();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shortcut, undone, handleUndo]);

  return (
    <ToastSurface ref={ref} data-status={undone ? "success" : "pending"} className={cn(undone && "border-primary/25")}>
      {undone ? <ToastStatusIcon status="success" /> : <CountdownRing progress={progress} duration={duration} />}
      <div className="grid min-w-0 flex-1 gap-0.5 pt-1">
        <motion.p
          key={undone ? "undone" : "pending"}
          className="leading-snug font-medium"
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {undone ? undoneTitle : title}
        </motion.p>
        {description && !undone && <p className="text-[0.8125rem] leading-snug text-muted-foreground">{description}</p>}
      </div>
      {!undone && (
        <button
          type="button"
          onClick={handleUndo}
          className={cn(
            "mt-0.5 inline-flex h-7 shrink-0 items-center gap-1.5 self-start rounded-md bg-primary/10 px-2.5 text-xs font-medium text-primary outline-none",
            "transition-[background-color,box-shadow] duration-150 hover:bg-primary/20 focus-visible:ring-[3px] focus-visible:ring-ring/50"
          )}
        >
          <Undo2 className="size-3.5" aria-hidden />
          {undoLabel}
        </button>
      )}
      <ToastClose
        onClick={() => {
          if (!undone) onCommit();
          toast.dismiss(id);
        }}
      />
    </ToastSurface>
  );
}

/** A ring that drains with `progress`, with the whole seconds left in the middle. */
function CountdownRing({ progress, duration }: { progress: MotionValue<number>; duration: number }) {
  const dashOffset = useTransform(progress, (p) => CIRCUMFERENCE * (1 - p));
  const seconds = useTransform(progress, (p) => Math.ceil((p * duration) / 1000));

  return (
    <span aria-hidden className="relative grid size-7 shrink-0 place-items-center">
      <svg viewBox="0 0 28 28" className="absolute inset-0 -rotate-90">
        <circle cx="14" cy="14" r={RADIUS} fill="none" strokeWidth="2.5" className="stroke-white/10" />
        <motion.circle
          cx="14"
          cy="14"
          r={RADIUS}
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          className="stroke-primary"
          style={{ strokeDashoffset: dashOffset }}
        />
      </svg>
      <motion.span className="font-mono text-[0.6875rem] font-semibold text-foreground tabular-nums">{seconds}</motion.span>
    </span>
  );
}
