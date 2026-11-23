"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";
import { CheckIcon, MessageSquareText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const morph: Transition = { type: "spring", bounce: 0.12, duration: 0.5 };
const fade: Transition = { duration: 0.2, ease: "easeOut" };

type Status = "idle" | "submitting" | "success" | "error";

export interface FeedbackPopoverProps {
  /** Text on the trigger button, which becomes the panel title. */
  label?: string;
  /** Icon on the trigger. Pass null to hide it. */
  icon?: React.ReactNode;
  placeholder?: string;
  /** Runs on submit. Return a promise to show the loading state; throw to show an error. */
  onSubmit?: (message: string) => unknown | Promise<unknown>;
  /** Shown after a successful submit, before the panel closes itself. */
  successMessage?: React.ReactNode;
  /** How long the success state stays before closing, in ms. */
  successDuration?: number;
  /** Maximum message length. Shows a counter when set. */
  maxLength?: number;
  /** Open downward from the button (bottom) or upward (top). */
  side?: "top" | "bottom";
  /** Line the panel up with the button's left (start) or right (end) edge. */
  align?: "start" | "end";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  /** Classes for the open panel (e.g. a different width). */
  panelClassName?: string;
}

/**
 * A feedback button that morphs into a small form. The button and the panel
 * share a Motion `layoutId`, so the pill stretches into the panel and the
 * label flies into the title; on submit the form crossfades to a success
 * state and the panel shrinks back into the button. Non-modal like a popover:
 * focus moves to the textarea, Escape or a click outside closes it and focus
 * returns to the button. ⌘/Ctrl + Enter submits. Renders inline (not
 * portalled) so the morph can be measured: leave room around it and avoid
 * `overflow: hidden` ancestors. Fades instead of morphing under reduced motion.
 */
export function FeedbackPopover({
  label = "Feedback",
  icon = <MessageSquareText />,
  placeholder = "What's on your mind?",
  onSubmit,
  successMessage = "Thanks! We read every message.",
  successDuration = 1600,
  maxLength,
  side = "bottom",
  align = "start",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  panelClassName,
}: FeedbackPopoverProps) {
  const id = React.useId();
  const reduceMotion = useReducedMotion() ?? false;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;
  const [message, setMessage] = React.useState("");
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState<string | null>(null);

  const layoutId = (part: string) => (reduceMotion ? undefined : `${id}-${part}`);
  const panelId = `${id}-panel`;
  const titleId = `${id}-title`;
  const errorId = `${id}-error`;

  const setOpen = React.useCallback(
    (next: boolean, { restoreFocus = true } = {}) => {
      if (openProp === undefined) setInternalOpen(next);
      onOpenChange?.(next);
      if (!next) {
        setStatus("idle");
        setError(null);
        if (restoreFocus) triggerRef.current?.focus({ preventScroll: true });
      }
    },
    [openProp, onOpenChange]
  );

  // Focus the textarea once the panel is mounted.
  React.useEffect(() => {
    if (open) textareaRef.current?.focus({ preventScroll: true });
  }, [open]);

  // Close on a pointer press outside the component (like a popover).
  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false, { restoreFocus: false });
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, setOpen]);

  // After a successful submit, show the thank-you state for a moment, then close.
  React.useEffect(() => {
    if (status !== "success") return;
    const timer = window.setTimeout(() => {
      setMessage("");
      setOpen(false);
    }, successDuration);
    return () => window.clearTimeout(timer);
  }, [status, successDuration, setOpen]);

  const submit = async () => {
    if (!message.trim() || status === "submitting" || status === "success") return;
    setStatus("submitting");
    setError(null);
    try {
      await onSubmit?.(message.trim());
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    }
  };

  const busy = status === "submitting";
  const done = status === "success";

  return (
    <div ref={rootRef} className={cn("relative inline-block", className)}>
      <motion.button
        ref={triggerRef}
        type="button"
        layoutId={layoutId("surface")}
        transition={morph}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={open ? panelId : undefined}
        // Hidden under the open panel, so keep it out of the tab order meanwhile.
        tabIndex={open ? -1 : undefined}
        onClick={() => setOpen(!open)}
        style={{ borderRadius: 999 }}
        className={cn(
          "inline-flex h-9 items-center gap-2 border bg-card px-4 text-sm font-medium text-card-foreground outline-none",
          "transition-[border-color,box-shadow,background-color] duration-200 hover:border-primary/30 hover:bg-accent/40",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40",
          "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-primary"
        )}
      >
        {icon && (
          <motion.span layoutId={layoutId("icon")} transition={morph} className="inline-flex">
            {icon}
          </motion.span>
        )}
        <motion.span layoutId={layoutId("label")} layout="position" transition={morph}>
          {label}
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            id={panelId}
            role="dialog"
            aria-labelledby={titleId}
            layoutId={layoutId("surface")}
            transition={morph}
            initial={reduceMotion ? { opacity: 0 } : undefined}
            animate={reduceMotion ? { opacity: 1 } : undefined}
            exit={reduceMotion ? { opacity: 0 } : undefined}
            style={{ borderRadius: 16 }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.stopPropagation();
                setOpen(false);
              }
            }}
            onBlur={(event) => {
              const next = event.relatedTarget as Node | null;
              if (next && (!rootRef.current?.contains(next) || next === triggerRef.current)) {
                setOpen(false, { restoreFocus: false });
              }
            }}
            className={cn(
              "absolute z-50 w-80 overflow-hidden border bg-popover text-popover-foreground",
              "shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_20px_48px_-12px_rgb(0_0_0/0.75)]",
              side === "bottom" ? "top-0" : "bottom-0",
              align === "start" ? "left-0" : "right-0",
              panelClassName
            )}
          >
            <div className="flex items-center gap-2 px-4 pt-3.5 pb-2 text-sm font-medium [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-primary">
              {icon && (
                <motion.span layoutId={layoutId("icon")} transition={morph} className="inline-flex">
                  {icon}
                </motion.span>
              )}
              <motion.span id={titleId} layoutId={layoutId("label")} layout="position" transition={morph}>
                {label}
              </motion.span>
            </div>

            <div className="grid">
              {/* The form stays mounted under the success state so the panel never changes size. */}
              <motion.form
                className="col-start-1 row-start-1 px-4 pb-4"
                inert={done}
                aria-hidden={done || undefined}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
                animate={{ opacity: done ? 0 : 1, y: 0, transition: { ...fade, delay: done || reduceMotion ? 0 : 0.12 } }}
                exit={{ opacity: 0, transition: { duration: 0.08 } }}
                onSubmit={(event) => {
                  event.preventDefault();
                  void submit();
                }}
              >
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(event) => {
                    setMessage(event.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                      event.preventDefault();
                      void submit();
                    }
                  }}
                  placeholder={placeholder}
                  maxLength={maxLength}
                  rows={4}
                  aria-label={`${label} message`}
                  aria-invalid={status === "error" || undefined}
                  aria-describedby={error ? errorId : undefined}
                  className={cn(
                    "block w-full resize-none rounded-lg border border-input bg-input/30 px-3 py-2 text-sm outline-none",
                    "placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-200",
                    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30",
                    "aria-invalid:border-destructive aria-invalid:ring-destructive/20"
                  )}
                />
                <div className="mt-1.5 flex min-h-5 items-center justify-between gap-2 text-xs">
                  <AnimatePresence initial={false} mode="wait">
                    {error ? (
                      <motion.p
                        key="error"
                        id={errorId}
                        role="alert"
                        className="truncate text-destructive"
                        initial={{ opacity: 0, x: reduceMotion ? 0 : -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={fade}
                      >
                        {error}
                      </motion.p>
                    ) : (
                      <motion.p
                        key="hint"
                        className="text-muted-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={fade}
                      >
                        <kbd className="font-sans">⌘</kbd>
                        <kbd className="font-sans">↵</kbd> to send
                      </motion.p>
                    )}
                  </AnimatePresence>
                  {maxLength && (
                    <span className="shrink-0 text-muted-foreground tabular-nums" aria-hidden>
                      {message.length}/{maxLength}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    loading={busy}
                    loadingText="Sending"
                    disabled={!message.trim() && !busy}
                  >
                    Send
                  </Button>
                </div>
              </motion.form>

              <AnimatePresence>
                {done && (
                  <motion.div
                    key="success"
                    role="status"
                    className="col-start-1 row-start-1 flex flex-col items-center justify-center gap-3 px-6 pb-6 text-center"
                    initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    transition={reduceMotion ? fade : { type: "spring", duration: 0.45, bounce: 0.3 }}
                  >
                    <motion.span
                      className="grid size-11 place-items-center rounded-full bg-primary/15 text-primary"
                      initial={{ scale: reduceMotion ? 1 : 0.4 }}
                      animate={{ scale: 1 }}
                      transition={reduceMotion ? { duration: 0 } : { type: "spring", duration: 0.5, bounce: 0.5, delay: 0.05 }}
                    >
                      <CheckIcon className="size-5" aria-hidden />
                    </motion.span>
                    <p className="text-sm text-muted-foreground">{successMessage}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
