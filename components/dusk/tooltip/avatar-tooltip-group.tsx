"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface AvatarTooltipItem {
  name: string;
  /** Second line in the tooltip, e.g. a role or status. */
  role?: string;
  /** Image URL. Falls back to initials on a color derived from the name. */
  src?: string;
  /** Override the generated initials. */
  initials?: string;
}

export interface AvatarTooltipGroupProps extends React.ComponentProps<"div"> {
  items: AvatarTooltipItem[];
  /** Show at most this many avatars; the rest collapse into a "+N" chip with its own tooltip. */
  max?: number;
  /** Avatar diameter in px. */
  size?: number;
  /** Called when an avatar is clicked. */
  onAvatarClick?: (item: AvatarTooltipItem) => void;
}

const tiltSpring = { stiffness: 220, damping: 26, mass: 0.5 };

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

/** Deterministic hue from the name, so SSR and client agree and colors are stable. */
function hueOf(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % 360;
  return hash;
}

function GroupMember({
  label,
  tooltip,
  size,
  onClick,
  children,
  className,
  style,
}: {
  label: string;
  tooltip: React.ReactNode;
  size: number;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  // Pointer position across the avatar: -1 (left edge) … 1 (right edge).
  const pointer = useMotionValue(0);
  const rotate = useSpring(useTransform(pointer, [-1, 1], [-6, 6]), tiltSpring);
  const x = useSpring(useTransform(pointer, [-1, 1], [-4, 4]), tiltSpring);

  const handleMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
  };

  return (
    <Tooltip open={open} onOpenChange={setOpen} delayDuration={0}>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          onClick={onClick}
          onPointerMove={handleMove}
          onPointerLeave={() => pointer.set(0)}
          className={cn(
            "relative -ms-3 grid shrink-0 place-items-center overflow-hidden rounded-full font-semibold text-white outline-none first:ms-0",
            "ring-2 ring-background transition-[translate,box-shadow] duration-150 ease-out",
            "hover:z-10 hover:-translate-y-0.5 focus-visible:z-10 focus-visible:-translate-y-0.5",
            "focus-visible:ring-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0",
            "motion-reduce:focus-visible:translate-y-0",
            className
          )}
          style={{ width: size, height: size, fontSize: size * 0.36, ...style }}
        >
          {children}
        </button>
      </TooltipTrigger>
      <AnimatePresence>
        {open && (
          <TooltipPrimitive.Portal forceMount key="tooltip">
            <TooltipPrimitive.Content
              forceMount
              asChild
              side="top"
              sideOffset={10}
              // Follow the avatar while it lifts on hover.
              updatePositionStrategy="always"
            >
              <motion.div
                data-slot="tooltip-content"
                initial={{ opacity: 0, y: 4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.96, transition: { duration: 0.1 } }}
                transition={{ type: "spring", bounce: 0.1, duration: 0.25 }}
                style={{ rotate, x, transformOrigin: "var(--radix-tooltip-content-transform-origin)" }}
                className={cn(
                  "z-50 rounded-md border border-white/10 bg-popover px-3 py-1.5 text-center text-popover-foreground",
                  "shadow-md"
                )}
              >
                {tooltip}
              </motion.div>
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        )}
      </AnimatePresence>
    </Tooltip>
  );
}

/**
 * Overlapping avatars for teams, collaborators or "who's here". Hovering one
 * lifts it above its neighbours and opens a name card that tilts slightly
 * toward the cursor as you move across the face. Extra members collapse
 * into a "+N" chip whose tooltip lists them. Every avatar is a real button,
 * so tooltips also open on keyboard focus. Tilt uses motion values (no React
 * re-renders), ignores touch and turns off under reduced motion.
 */
export function AvatarTooltipGroup({
  items,
  max = 5,
  size = 40,
  onAvatarClick,
  className,
  ...props
}: AvatarTooltipGroupProps) {
  const visible = items.slice(0, max);
  const hidden = items.slice(max);

  return (
    <div data-slot="avatar-tooltip-group" role="group" className={cn("flex items-center", className)} {...props}>
      {visible.map((item) => {
        const hue = hueOf(item.name);
        return (
          <GroupMember
            key={item.name}
            label={item.name}
            size={size}
            onClick={onAvatarClick ? () => onAvatarClick(item) : undefined}
            style={
              item.src
                ? undefined
                : {
                    background: `oklch(0.42 0.06 ${hue})`,
                  }
            }
            tooltip={
              <>
                <p className="text-sm font-semibold leading-5">{item.name}</p>
                {item.role && <p className="text-xs text-muted-foreground">{item.role}</p>}
              </>
            }
          >
            {item.src ? (
              // Plain <img> so the block works outside Next.js; the button carries the name.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.src} alt="" className="size-full object-cover" draggable={false} />
            ) : (
              <span aria-hidden>
                {item.initials ?? initialsOf(item.name)}
              </span>
            )}
          </GroupMember>
        );
      })}
      {hidden.length > 0 && (
        <GroupMember
          label={`${hidden.length} more: ${hidden.map((item) => item.name).join(", ")}`}
          size={size}
          className="border border-white/10 bg-muted text-muted-foreground"
          tooltip={
            <ul className="space-y-0.5 text-left text-xs">
              {hidden.map((item) => (
                <li key={item.name}>
                  <span className="font-medium text-foreground">{item.name}</span>
                  {item.role && <span className="text-muted-foreground"> · {item.role}</span>}
                </li>
              ))}
            </ul>
          }
        >
          <span aria-hidden>+{hidden.length}</span>
        </GroupMember>
      )}
    </div>
  );
}
