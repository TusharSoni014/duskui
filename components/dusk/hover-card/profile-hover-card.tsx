"use client";

import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { BadgeCheck, CalendarDays, MapPin } from "lucide-react";

import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

export interface ProfileUser {
  name: string;
  /** Shown as @handle. */
  handle?: string;
  /** Avatar URL. Falls back to initials if it's missing or fails to load. */
  avatarUrl?: string;
  bio?: React.ReactNode;
  location?: string;
  /** e.g. "Joined March 2021". */
  joined?: string;
  verified?: boolean;
  /** Short stats under the bio, e.g. [{ label: "Followers", value: "12.4k" }]. */
  stats?: { label: string; value: React.ReactNode }[];
  /** Cover color or image behind the avatar. Any CSS background. */
  cover?: string;
}

export interface ProfileHoverCardProps
  extends Omit<React.ComponentProps<typeof HoverCardPrimitive.Content>, "forceMount" | "asChild" | "children"> {
  user: ProfileUser;
  /** The trigger, usually a link to the profile (e.g. an @mention or avatar). */
  children: React.ReactElement;
  /** Buttons in the top-right corner, e.g. a Follow button. */
  action?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** ms before opening on hover. */
  openDelay?: number;
  /** ms before closing after the pointer leaves. */
  closeDelay?: number;
}

/**
 * A user preview card that opens out of the trigger. It scales up from
 * Radix's transform origin (the edge nearest the trigger, even after a flip),
 * then the avatar and the details fade up in sequence. The avatar is a
 * plain <img> layered over the user's initials, so a missing or broken image
 * still looks intentional. Opens on hover and on keyboard focus of the
 * trigger; Escape closes it. Fades only under reduced motion.
 */
export function ProfileHoverCard({
  user,
  children,
  action,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  openDelay,
  closeDelay,
  side = "bottom",
  align = "start",
  sideOffset = 8,
  className,
  ...props
}: ProfileHoverCardProps) {
  const reduceMotion = useReducedMotion();
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const surface: Variants = reduceMotion
    ? { closed: { opacity: 0, transition: { duration: 0.1 } }, open: { opacity: 1, transition: { duration: 0.15 } } }
    : {
        closed: { opacity: 0, scale: 0.96, transition: { duration: 0.12, ease: "easeIn" } },
        open: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.18, ease: "easeOut", staggerChildren: 0.04, delayChildren: 0.05 },
        },
      };

  const item: Variants = reduceMotion
    ? { closed: { opacity: 1 }, open: { opacity: 1 } }
    : {
        closed: { opacity: 0, y: 4, transition: { duration: 0.08 } },
        open: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
      };

  const pop: Variants = reduceMotion
    ? item
    : {
        closed: { opacity: 0, scale: 0.96, transition: { duration: 0.08 } },
        open: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
      };

  return (
    <HoverCard open={open} onOpenChange={setOpen} openDelay={openDelay} closeDelay={closeDelay}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <AnimatePresence>
        {open && (
          // forceMount hands mounting to AnimatePresence so the exit animation can play.
          <HoverCardPrimitive.Portal key="profile" forceMount>
            <HoverCardPrimitive.Content
              forceMount
              asChild
              side={side}
              align={align}
              sideOffset={sideOffset}
              {...props}
            >
              <motion.div
                data-slot="profile-hover-card"
                className={cn(
                  "z-50 w-80 overflow-hidden rounded-xl border bg-popover text-popover-foreground outline-none",
                  "origin-(--radix-hover-card-content-transform-origin)",
                  "shadow-lg",
                  className
                )}
                variants={surface}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <div
                  aria-hidden
                  className="h-16"
                  style={{
                    background:
                      user.cover ?? "var(--muted)",
                  }}
                />
                <div className="relative px-4 pb-4">
                  <div className="-mt-8 flex items-end justify-between gap-3">
                    <motion.div variants={pop}>
                      <ProfileAvatar
                        name={user.name}
                        src={user.avatarUrl}
                        className="size-16 border-4 border-popover text-lg"
                      />
                    </motion.div>
                    {action && (
                      <motion.div variants={item} className="flex gap-2 pb-1">
                        {action}
                      </motion.div>
                    )}
                  </div>

                  <motion.div variants={item} className="mt-3">
                    <p className="flex items-center gap-1.5 leading-tight font-semibold">
                      {user.name}
                      {user.verified && (
                        <BadgeCheck className="size-4 shrink-0 text-muted-foreground" aria-label="Verified" role="img" />
                      )}
                    </p>
                    {user.handle && <p className="text-sm text-muted-foreground">@{user.handle}</p>}
                  </motion.div>

                  {user.bio && (
                    <motion.p variants={item} className="mt-3 text-sm leading-relaxed text-foreground/85">
                      {user.bio}
                    </motion.p>
                  )}

                  {(user.location || user.joined) && (
                    <motion.div variants={item} className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      {user.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3.5" aria-hidden />
                          {user.location}
                        </span>
                      )}
                      {user.joined && (
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="size-3.5" aria-hidden />
                          {user.joined}
                        </span>
                      )}
                    </motion.div>
                  )}

                  {user.stats?.length ? (
                    <motion.dl variants={item} className="mt-4 flex gap-5 border-t pt-3 text-sm">
                      {user.stats.map((stat) => (
                        <div key={stat.label} className="flex flex-col-reverse">
                          <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                          <dd className="font-semibold tabular-nums">{stat.value}</dd>
                        </div>
                      ))}
                    </motion.dl>
                  ) : null}
                </div>
              </motion.div>
            </HoverCardPrimitive.Content>
          </HoverCardPrimitive.Portal>
        )}
      </AnimatePresence>
    </HoverCard>
  );
}

/** Up to two initials from a name: "Ada Kim" → "AK". */
function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

/**
 * A plain <img> over the user's initials. If the image is missing or fails,
 * the initials simply show through, with no layout shift. Decorative: the
 * name is always written next to it.
 */
export function ProfileAvatar({ name, src, className }: { name: string; src?: string; className?: string }) {
  const [failedSrc, setFailedSrc] = React.useState<string>();
  const showImage = Boolean(src) && failedSrc !== src;

  return (
    <span
      aria-hidden
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-muted font-semibold text-foreground select-none",
        className
      )}
    >
      {initialsOf(name)}
      {showImage && (
        // eslint-disable-next-line @next/next/no-img-element -- plain <img> keeps the block framework-agnostic.
        <img
          key={src}
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailedSrc(src)}
          className="absolute inset-0 size-full object-cover"
        />
      )}
    </span>
  );
}
