"use client";

import * as React from "react";
import { AnimatePresence, motion, useAnimate, useReducedMotion } from "motion/react";
import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface ConfirmDialogProps {
  /** Element that opens the dialog, usually a Button. Omit when controlling `open` yourself. */
  trigger?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Runs on confirm. Return a promise to show a loading state; the dialog closes when it resolves and stays open (with the error) if it throws. */
  onConfirm: () => unknown | Promise<unknown>;
  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  /** Label shown next to the spinner while confirming. */
  pendingLabel?: React.ReactNode;
  /** `destructive` turns the icon and confirm button red. */
  variant?: "default" | "destructive";
  /** Icon at the top. Defaults to a warning triangle for destructive dialogs; pass `null` to hide. */
  icon?: React.ReactNode;
  /** Require the user to type this text before confirming (e.g. a project name). */
  confirmText?: string;
  /** Message shown when `onConfirm` throws. Defaults to the error's message. */
  errorMessage?: React.ReactNode;
}

/**
 * A confirmation dialog for risky actions. The confirm button shows a spinner
 * while your async `onConfirm` runs (keeping its width), Escape and outside
 * clicks are blocked mid-request, and a failure shakes the dialog and shows
 * the error inline. Opens with focus on Cancel and uses role="alertdialog".
 */
export function ConfirmDialog({
  trigger,
  open: openProp,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  pendingLabel,
  variant = "default",
  icon,
  confirmText,
  errorMessage,
}: ConfirmDialogProps) {
  const id = React.useId();
  const reduceMotion = useReducedMotion();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<React.ReactNode>(null);
  const [typed, setTyped] = React.useState("");
  const open = openProp ?? internalOpen;
  const destructive = variant === "destructive";
  const canConfirm = !confirmText || typed === confirmText;
  const shownIcon = icon === undefined ? (destructive ? <TriangleAlert /> : null) : icon;

  const setOpen = (next: boolean) => {
    if (pending) return;
    if (openProp === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const handleConfirm = async () => {
    if (pending || !canConfirm) return;
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
        animate(scope.current, { x: [0, -8, 8, -5, 5, 0] }, { duration: 0.4 });
      }
    }
  };

  const blockWhilePending = (event: Event) => {
    if (pending) event.preventDefault();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        role="alertdialog"
        showCloseButton={false}
        aria-busy={pending || undefined}
        className="sm:max-w-md"
        onOpenAutoFocus={(event) => {
          // Fresh state on every open, starting on the safe choice
          // (or the text field when one is required).
          setError(null);
          setTyped("");
          event.preventDefault();
          (confirmText ? inputRef.current : cancelRef.current)?.focus();
        }}
        onEscapeKeyDown={blockWhilePending}
        onInteractOutside={blockWhilePending}
      >
        <div ref={scope} className="grid gap-4">
          <DialogHeader className="sm:pr-0">
            {shownIcon && (
              <motion.div
                aria-hidden
                className={cn(
                  "mx-auto mb-2 grid size-11 place-items-center rounded-full sm:mx-0 [&_svg]:size-5",
                  destructive ? "bg-destructive/15 text-destructive" : "border bg-muted text-foreground"
                )}
                initial={reduceMotion ? false : { scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeOut", delay: 0.05 }}
              >
                {shownIcon}
              </motion.div>
            )}
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>

          {confirmText && (
            <div className="grid gap-2">
              <label htmlFor={`${id}-confirm-text`} className="text-sm text-muted-foreground">
                Type <span className="font-mono font-medium text-foreground">{confirmText}</span> to confirm.
              </label>
              <Input
                ref={inputRef}
                id={`${id}-confirm-text`}
                value={typed}
                onChange={(event) => setTyped(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleConfirm();
                }}
                readOnly={pending}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          )}

          <AnimatePresence initial={false}>
            {error && (
              <motion.p
                role="alert"
                className="text-sm text-destructive"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", duration: 0.3, bounce: 0 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <DialogFooter>
            <Button
              ref={cancelRef}
              variant="outline"
              aria-disabled={pending || undefined}
              className="aria-disabled:opacity-50"
              onClick={() => setOpen(false)}
            >
              {cancelLabel}
            </Button>
            <Button
              variant={destructive ? "destructive" : "default"}
              loading={pending}
              loadingText={pendingLabel}
              // Set here too: this prop overrides the one Button derives from `loading`.
              aria-disabled={pending || !canConfirm || undefined}
              className={cn(!canConfirm && "cursor-not-allowed opacity-50")}
              onClick={handleConfirm}
            >
              {confirmLabel}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
