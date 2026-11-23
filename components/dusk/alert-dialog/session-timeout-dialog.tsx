"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SessionTimeoutDialogProps {
  /** Show the warning. Open it from your idle timer; it closes itself when the user answers or time runs out. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Seconds the user has to respond. */
  seconds?: number;
  /** The user chose to stay (button or Escape). Refresh the session here. */
  onStay?: () => void;
  /** The user chose to leave, or time ran out (`reason === "timeout"`). Sign out here. */
  onSignOut?: (reason: "manual" | "timeout") => void;
  title?: React.ReactNode;
  /** Text under the title. Receives the seconds left. */
  description?: React.ReactNode | ((secondsLeft: number) => React.ReactNode);
  stayLabel?: React.ReactNode;
  signOutLabel?: React.ReactNode;
}

const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * "Are you still there?" A session-timeout warning built on Alert Dialog: it
 * can't be dismissed by clicking outside, focus lands on "Stay signed in",
 * and Escape also counts as staying. A ring drains around the seconds left
 * and turns red for the last ten; when it empties, `onSignOut("timeout")`
 * runs. The countdown uses wall-clock time, so it stays accurate even if the
 * tab was in the background. Screen readers hear the time left when it opens
 * and once more at ten seconds, not every tick.
 */
export function SessionTimeoutDialog({
  open,
  onOpenChange,
  seconds = 60,
  onStay,
  onSignOut,
  title = "Are you still there?",
  description = (left: number) => `For your security, you'll be signed out in ${left} seconds.`,
  stayLabel = "Stay signed in",
  signOutLabel = "Sign out",
}: SessionTimeoutDialogProps) {
  // Any close that isn't a sign-out (Escape, the stay button) means "stay".
  const signingOut = React.useRef(false);
  const stayRef = React.useRef<HTMLButtonElement>(null);

  const handleOpenChange = (next: boolean) => {
    if (!next && !signingOut.current) onStay?.();
    signingOut.current = false;
    onOpenChange(next);
  };

  const signOut = (reason: "manual" | "timeout") => {
    signingOut.current = true;
    onSignOut?.(reason);
    handleOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent
        size="sm"
        onOpenAutoFocus={(event) => {
          // Start on the safe, expected answer.
          event.preventDefault();
          stayRef.current?.focus();
        }}
      >
        {/* Mounted only while open, so the countdown restarts on every open. */}
        <Countdown
          seconds={seconds}
          title={title}
          description={description}
          stayLabel={stayLabel}
          signOutLabel={signOutLabel}
          onSignOut={signOut}
          stayRef={stayRef}
          active={open}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}

function Countdown({
  seconds,
  title,
  description,
  stayLabel,
  signOutLabel,
  onSignOut,
  stayRef,
  active,
}: Required<Pick<SessionTimeoutDialogProps, "seconds" | "title" | "description" | "stayLabel" | "signOutLabel">> & {
  onSignOut: (reason: "manual" | "timeout") => void;
  stayRef: React.Ref<HTMLButtonElement>;
  /** False during the close animation, so a late tick can't sign the user out after they chose to stay. */
  active: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const [deadline] = React.useState(() => Date.now() + seconds * 1000);
  const [msLeft, setMsLeft] = React.useState(seconds * 1000);
  const secondsLeft = Math.ceil(msLeft / 1000);
  const urgent = secondsLeft <= 10;
  const timeout = React.useEffectEvent(() => onSignOut("timeout"));

  React.useEffect(() => {
    if (!active) return;
    const tick = () => {
      const left = Math.max(0, deadline - Date.now());
      setMsLeft(left);
      if (left === 0) {
        window.clearInterval(interval);
        timeout();
      }
    };
    const interval = window.setInterval(tick, 200);
    return () => window.clearInterval(interval);
  }, [deadline, active]);

  const text = typeof description === "function" ? description(secondsLeft) : description;
  // Only re-announce at the 10-second mark, not every second.
  const announced = typeof description === "function" ? description(urgent ? Math.min(10, seconds) : seconds) : description;

  return (
    <>
      <AlertDialogHeader>
        <div className="relative mb-2 grid size-16 place-items-center" aria-hidden>
          <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90">
            <circle cx="32" cy="32" r={RADIUS} fill="none" strokeWidth="4" className="stroke-muted" />
            <motion.circle
              cx="32"
              cy="32"
              r={RADIUS}
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              className={cn(
                "transition-[stroke] duration-300",
                urgent ? "stroke-destructive" : "stroke-primary"
              )}
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - msLeft / (seconds * 1000)) }}
              transition={{ duration: 0.2, ease: "linear" }}
            />
          </svg>
          <motion.span
            key={secondsLeft}
            className={cn(
              "font-mono text-lg font-semibold tabular-nums",
              urgent ? "text-destructive" : "text-foreground"
            )}
            initial={reduceMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
          >
            {secondsLeft}
          </motion.span>
        </div>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        {/* Read once when the dialog opens; the live region below re-announces only at ten seconds. */}
        <AlertDialogDescription>{text}</AlertDialogDescription>
        <p className="sr-only" aria-live="polite">
          {announced}
        </p>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <Button variant="outline" onClick={() => onSignOut("manual")}>
          {signOutLabel}
        </Button>
        <AlertDialogAction ref={stayRef}>{stayLabel}</AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}
