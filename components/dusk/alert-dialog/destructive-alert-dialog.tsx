"use client";

import * as React from "react";
import { AnimatePresence, motion, useAnimate, useReducedMotion } from "motion/react";
import { Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DestructiveAlertDialogProps {
  /** Element that opens the dialog, usually a Button. Omit when controlling `open` yourself. */
  trigger?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** What will be lost, shown as a list that staggers in, e.g. ["12 deployments", "3 domains"]. */
  consequences?: React.ReactNode[];
  /** Runs on confirm. Return a promise to show a loading state; the dialog closes when it resolves and stays open (with the error) if it throws. */
  onConfirm: () => unknown | Promise<unknown>;
  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  /** Shown next to the spinner while `onConfirm` runs. */
  pendingLabel?: React.ReactNode;
  /** Require the user to type this exact text before confirming, e.g. a project name. */
  confirmText?: string;
  /** Icon in the pulsing badge. Defaults to a trash can. */
  icon?: React.ReactNode;
  /** Message shown when `onConfirm` throws. Defaults to the error's message. */
  errorMessage?: React.ReactNode;
}

const spring = { type: "spring", duration: 0.35, bounce: 0 } as const;

/**
 * A destructive confirmation built on Alert Dialog semantics: clicking outside
 * never closes it, focus starts on Cancel (or the confirm field), and Escape
 * is blocked while the action runs. The red icon sends out a slow pulse, an
 * optional list spells out what will be lost, and type-to-confirm lights up
 * each character as it matches. The confirm button uses the DuskUI Button
 * `loading` state for async work; a failure shakes the dialog and shows the
 * error inline.
 */
export function DestructiveAlertDialog({
  trigger,
  open: openProp,
  onOpenChange,
  title,
  description,
  consequences,
  onConfirm,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  pendingLabel,
  confirmText,
  icon = <Trash2 />,
  errorMessage,
}: DestructiveAlertDialogProps) {
  const id = React.useId();
  const reduceMotion = useReducedMotion();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<React.ReactNode>(null);
  const [typed, setTyped] = React.useState("");
  const open = openProp ?? internalOpen;
  const matched = !confirmText || typed === confirmText;

  const setOpen = (next: boolean) => {
    if (pending) return;
    if (openProp === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const handleConfirm = async () => {
    if (pending) return;
    if (!matched) {
      inputRef.current?.focus();
      return;
    }
    setError(null);
    setPending(true);
    try {
      await onConfirm();
      setPending(false);
      if (openProp === undefined) setInternalOpen(false);
      onOpenChange?.(false);
    } catch (err) {
      setPending(false);
      setError(errorMessage ?? (err instanceof Error ? err.message : "Something went wrong."));
      if (!reduceMotion && scope.current) {
        animate(scope.current, { x: [0, -10, 9, -6, 4, 0] }, { duration: 0.45, ease: "easeOut" });
      }
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent
        aria-busy={pending || undefined}
        className="sm:max-w-md"
        onOpenAutoFocus={(event) => {
          // Fresh state on every open, however it was opened.
          setError(null);
          setTyped("");
          // Radix focuses Cancel by default; jump to the field when typing is required.
          if (confirmText) {
            event.preventDefault();
            inputRef.current?.focus();
          }
        }}
        onEscapeKeyDown={(event) => {
          if (pending) event.preventDefault();
        }}
      >
        <div ref={scope} className="grid gap-5">
          <AlertDialogHeader>
            <PulseIcon>{icon}</PulseIcon>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            {description ? (
              <AlertDialogDescription>{description}</AlertDialogDescription>
            ) : (
              <AlertDialogDescription className="sr-only">This action can&apos;t be undone.</AlertDialogDescription>
            )}
          </AlertDialogHeader>

          {consequences?.length ? (
            <motion.ul
              className="grid gap-1.5 rounded-lg border border-destructive/20 bg-destructive/[0.06] p-3 text-sm"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } } }}
            >
              {consequences.map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-2 text-foreground/85"
                  variants={{
                    hidden: { opacity: 0, x: reduceMotion ? 0 : -6 },
                    visible: { opacity: 1, x: 0, transition: spring },
                  }}
                >
                  <span aria-hidden className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-destructive" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          ) : null}

          {confirmText && (
            <div className="grid gap-2">
              <label htmlFor={`${id}-confirm`} className="text-sm text-muted-foreground">
                Type <MatchedText target={confirmText} typed={typed} /> to confirm.
              </label>
              <input
                ref={inputRef}
                id={`${id}-confirm`}
                value={typed}
                onChange={(event) => setTyped(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void handleConfirm();
                  }
                }}
                readOnly={pending}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-invalid={typed.length > 0 && !confirmText.startsWith(typed) ? true : undefined}
                className={cn(
                  "h-9 w-full rounded-md border border-input bg-input/30 px-3 font-mono text-sm outline-none",
                  "transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground",
                  "focus-visible:border-destructive/60 focus-visible:ring-[3px] focus-visible:ring-destructive/20",
                  "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
                  matched && "border-destructive/60"
                )}
              />
            </div>
          )}

          <AnimatePresence initial={false}>
            {error && (
              <motion.p
                role="alert"
                className="overflow-hidden text-sm text-destructive"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={spring}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <AlertDialogFooter>
            <AlertDialogCancel
              aria-disabled={pending || undefined}
              className="aria-disabled:opacity-50"
              onClick={(event) => {
                // Keep the dialog open while the action runs.
                if (pending) event.preventDefault();
              }}
            >
              {cancelLabel}
            </AlertDialogCancel>
            <Button
              variant="destructive"
              loading={pending}
              loadingText={pendingLabel}
              // Set here too: this prop overrides the one Button derives from `loading`.
              aria-disabled={pending || !matched || undefined}
              className={cn(!matched && "cursor-not-allowed opacity-50")}
              onClick={handleConfirm}
            >
              {confirmLabel}
            </Button>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/** The red icon badge. Two rings ripple out from it on a slow loop; static under reduced motion. */
function PulseIcon({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className="relative mb-2 grid size-12 shrink-0 place-items-center rounded-full bg-destructive/15 text-destructive [&_svg]:size-5"
      initial={reduceMotion ? { opacity: 0 } : { scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", duration: 0.5, bounce: 0.45, delay: 0.05 }}
    >
      {[0, 1].map((ring) => (
        <motion.span
          key={ring}
          className="absolute inset-0 rounded-full border border-destructive/50 motion-reduce:hidden"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.9, opacity: 0 }}
          transition={{ duration: 2, ease: "easeOut", repeat: Infinity, delay: 0.4 + ring * 1 }}
        />
      ))}
      {children}
    </motion.div>
  );
}

/** Renders the text to type, lighting up each character that already matches. */
function MatchedText({ target, typed }: { target: string; typed: string }) {
  let matchedCount = 0;
  while (matchedCount < target.length && typed[matchedCount] === target[matchedCount]) matchedCount++;

  return (
    <span className="rounded bg-muted px-1 py-0.5 font-mono font-medium text-foreground">
      {/* Screen readers get the plain text once, not one span per letter. */}
      <span className="sr-only">{target}</span>
      <span aria-hidden>
        {target.split("").map((char, index) => (
          <span
            key={index}
            className={cn(
              "transition-colors duration-150",
              index < matchedCount ? "text-destructive [text-shadow:0_0_8px_var(--destructive)]" : "text-foreground"
            )}
          >
            {char}
          </span>
        ))}
      </span>
    </span>
  );
}
