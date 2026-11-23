"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const spring: Transition = { type: "spring", duration: 0.3, bounce: 0.1 };
const instant: Transition = { duration: 0 };

const sizes = {
  sm: { avatar: "size-8 text-[0.65rem]", overlap: "-ml-2.5", spread: 10 },
  default: { avatar: "size-10 text-xs", overlap: "-ml-3", spread: 14 },
  lg: { avatar: "size-12 text-sm", overlap: "-ml-4", spread: 18 },
} as const;

export type AvatarGroupItem = {
  /** Full name. Used for the accessible label, the hover name tag and the initials. */
  name: string;
  /** Image URL. Falls back to initials while loading or if it fails. */
  src?: string;
  /** Custom fallback content (defaults to the initials of `name`). */
  fallback?: React.ReactNode;
};

export interface AvatarGroupProps extends Omit<React.ComponentProps<"ul">, "children"> {
  items: AvatarGroupItem[];
  /** How many avatars to show before collapsing the rest into “+N”. */
  max?: number;
  size?: keyof typeof sizes;
  /** Extra pixels each avatar moves apart on hover. Defaults per size; 0 disables. */
  spread?: number;
  /** Show the hovered person's name above their avatar. */
  showNames?: boolean;
  /** Accessible label for the whole group, e.g. "Project members". */
  label?: string;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

/**
 * Overlapping stack of avatars that fans out when you hover it. The hovered
 * avatar lifts above its neighbours and shows a name tag; anything past `max`
 * collapses into a “+N” chip. Spreading uses transforms only, so nothing
 * around the group moves. Each avatar is labelled for screen readers and the
 * motion is instant under reduced motion.
 */
export function AvatarGroup({
  items,
  max = 4,
  size = "default",
  spread,
  showNames = true,
  label = "People",
  className,
  onPointerLeave,
  ...props
}: AvatarGroupProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [expanded, setExpanded] = React.useState(false);
  const config = sizes[size];
  const gap = spread ?? config.spread;

  const visible = items.slice(0, max);
  const hidden = items.length - visible.length;
  const count = visible.length + (hidden > 0 ? 1 : 0);
  const transition = reduceMotion ? instant : spring;

  // Fan out symmetrically around the centre so the group grows in both directions.
  const offset = (index: number) => (expanded ? (index - (count - 1) / 2) * gap : 0);

  return (
    <ul
      aria-label={label}
      className={cn("relative isolate flex items-center pl-0", className)}
      onPointerEnter={() => setExpanded(true)}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        setExpanded(false);
        setHovered(null);
      }}
      {...props}
    >
      {visible.map((item, index) => {
        const isHovered = hovered === index;
        return (
          <motion.li
            key={`${item.name}-${index}`}
            className={cn("relative", index > 0 && config.overlap)}
            style={{ zIndex: isHovered ? count + 1 : index }}
            initial={false}
            animate={{ x: offset(index), y: isHovered && !reduceMotion ? -4 : 0, scale: isHovered && !reduceMotion ? 1.04 : 1 }}
            transition={transition}
            onPointerEnter={() => setHovered(index)}
            onPointerLeave={() => setHovered((h) => (h === index ? null : h))}
          >
            <Avatar
              role="img"
              aria-label={item.name}
              className={cn(config.avatar, "ring-2 ring-background")}
            >
              {item.src && <AvatarImage src={item.src} alt="" />}
              <AvatarFallback aria-hidden>{item.fallback ?? initials(item.name)}</AvatarFallback>
            </Avatar>
            {showNames && (
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    key="name"
                    aria-hidden
                    className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-md border bg-popover px-2 py-1 text-xs font-medium whitespace-nowrap text-popover-foreground shadow-lg"
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 4, scale: reduceMotion ? 1 : 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: reduceMotion ? 0 : 2, scale: reduceMotion ? 1 : 0.96, transition: { duration: 0.1 } }}
                    transition={reduceMotion ? { duration: 0.15 } : { duration: 0.15, ease: "easeOut" }}
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            )}
          </motion.li>
        );
      })}
      {hidden > 0 && (
        <motion.li
          className={cn("relative", config.overlap)}
          style={{ zIndex: visible.length }}
          initial={false}
          animate={{ x: offset(count - 1) }}
          transition={transition}
        >
          <span
            role="img"
            aria-label={`${hidden} more`}
            className={cn(
              config.avatar,
              "flex items-center justify-center rounded-full bg-secondary font-medium text-secondary-foreground tabular-nums ring-2 ring-background"
            )}
          >
            <span aria-hidden>+{hidden}</span>
          </span>
        </motion.li>
      )}
    </ul>
  );
}
