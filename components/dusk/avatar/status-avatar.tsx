"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export type AvatarStatus = "online" | "away" | "busy" | "offline";

const statuses: Record<AvatarStatus, { label: string; dot: string; ring: string; pulse: boolean }> = {
  online: { label: "Online", dot: "bg-emerald-400", ring: "ring-emerald-400/70", pulse: true },
  away: { label: "Away", dot: "bg-amber-400", ring: "ring-amber-400/60", pulse: false },
  busy: { label: "Busy", dot: "bg-rose-500", ring: "ring-rose-500/70", pulse: true },
  offline: { label: "Offline", dot: "bg-zinc-500", ring: "ring-zinc-500/40", pulse: false },
};

const sizes = {
  sm: { avatar: "size-8 text-[0.65rem]", dot: "size-2.5", ring: "ring-[1.5px] ring-offset-[1.5px]" },
  default: { avatar: "size-10 text-xs", dot: "size-3", ring: "ring-2 ring-offset-2" },
  lg: { avatar: "size-14 text-sm", dot: "size-3.5", ring: "ring-2 ring-offset-[3px]" },
} as const;

export interface StatusAvatarProps extends Omit<React.ComponentProps<"span">, "children"> {
  /** Full name. Used for the accessible label and the default initials. */
  name: string;
  src?: string;
  /** Custom fallback content (defaults to initials). */
  fallback?: React.ReactNode;
  status?: AvatarStatus;
  size?: keyof typeof sizes;
  /** Draw a colored ring around the avatar in the status color. */
  showRing?: boolean;
  /** Pulse the dot for live statuses (online, busy). */
  pulse?: boolean;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

/**
 * Avatar with a presence indicator. The status dot sends out a soft pulse for
 * live statuses, pops when the status changes, and the optional ring
 * crossfades to the new color. Labelled as “Name (Status)” for screen readers;
 * the pulse stops under reduced motion.
 */
export function StatusAvatar({
  name,
  src,
  fallback,
  status = "online",
  size = "default",
  showRing = true,
  pulse = true,
  className,
  ...props
}: StatusAvatarProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const config = statuses[status];
  const sizing = sizes[size];

  return (
    <span
      role="img"
      aria-label={`${name} (${config.label})`}
      className={cn("relative inline-flex shrink-0", className)}
      {...props}
    >
      <Avatar
        className={cn(
          sizing.avatar,
          showRing && [sizing.ring, config.ring, "ring-offset-background transition-[box-shadow] duration-300"]
        )}
      >
        {src && <AvatarImage src={src} alt="" />}
        <AvatarFallback aria-hidden>{fallback ?? initials(name)}</AvatarFallback>
      </Avatar>

      <span aria-hidden className={cn("absolute right-0 bottom-0 grid place-items-center", sizing.dot)}>
        {pulse && config.pulse && !reduceMotion && (
          <motion.span
            key={`pulse-${status}`}
            className={cn("absolute inset-0 rounded-full", config.dot)}
            initial={{ scale: 1, opacity: 0.55 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeOut", repeat: Infinity, repeatDelay: 0.4 }}
          />
        )}
        <AnimatePresence initial={false}>
          <motion.span
            key={status}
            className={cn("relative col-start-1 row-start-1 size-full rounded-full ring-2 ring-background", config.dot)}
            initial={reduceMotion ? { opacity: 0 } : { scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { scale: 0.3, opacity: 0 }}
            transition={reduceMotion ? { duration: 0.15 } : { type: "spring", duration: 0.4, bounce: 0.5 }}
          />
        </AnimatePresence>
      </span>
    </span>
  );
}
