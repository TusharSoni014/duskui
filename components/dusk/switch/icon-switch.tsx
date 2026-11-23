"use client";

import * as React from "react";
import { AnimatePresence, motion, type Transition } from "motion/react";

import { Switch, type SwitchProps } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export interface IconSwitchProps extends Omit<SwitchProps, "thumbContent" | "checked" | "defaultChecked"> {
  checked?: boolean;
  defaultChecked?: boolean;
  /** Icon shown in the thumb when on. Omit both icons for the built-in sun → moon morph. */
  checkedIcon?: React.ReactNode;
  /** Icon shown in the thumb when off. */
  uncheckedIcon?: React.ReactNode;
}

const morph: Transition = { type: "spring", bounce: 0.1, duration: 0.4 };

// Precomputed so server and client render identical markup.
const rays = [
  [20, 12, 22.5, 12],
  [17.66, 17.66, 19.42, 19.42],
  [12, 20, 12, 22.5],
  [6.34, 17.66, 4.58, 19.42],
  [4, 12, 1.5, 12],
  [6.34, 6.34, 4.58, 4.58],
  [12, 4, 12, 1.5],
  [17.66, 6.34, 19.42, 4.58],
] as const;

/**
 * A single SVG that morphs between a sun and a crescent moon: the rays spin
 * and retract, the core swells and a mask "bites" the crescent out of it.
 */
export function SunMoonIcon({ moon, className }: { moon: boolean; className?: string }) {
  const maskId = `sun-moon-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <motion.svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      initial={false}
      animate={{ rotate: moon ? -30 : 0 }}
      transition={morph}
    >
      <mask id={maskId}>
        <rect width="24" height="24" fill="white" />
        <motion.circle
          r="7"
          fill="black"
          initial={false}
          animate={moon ? { cx: 18, cy: 6 } : { cx: 30, cy: -6 }}
          transition={morph}
        />
      </mask>
      <motion.circle
        cx="12"
        cy="12"
        fill="currentColor"
        mask={`url(#${maskId})`}
        initial={false}
        animate={{ r: moon ? 9 : 4.5 }}
        transition={morph}
      />
      <motion.g
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        initial={false}
        animate={moon ? { opacity: 0, scale: 0.4, rotate: -90 } : { opacity: 1, scale: 1, rotate: 0 }}
        transition={morph}
      >
        {rays.map(([x1, y1, x2, y2]) => (
          <line key={`${x1}-${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </motion.g>
    </motion.svg>
  );
}

const swap = {
  initial: { opacity: 0, scale: 0.6, rotate: -45 },
  animate: { opacity: 1, scale: 1, rotate: 0 },
  exit: { opacity: 0, scale: 0.6, rotate: 45 },
  transition: { type: "spring", bounce: 0.1, duration: 0.3 },
} as const;

/**
 * A switch with an icon inside the thumb. By default it is a theme toggle
 * whose thumb morphs from a sun into a moon; pass `checkedIcon` /
 * `uncheckedIcon` to spin between any two icons instead.
 * Built on the DuskUI Switch (Radix), so it submits with forms and is keyboard accessible.
 */
export function IconSwitch({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  checkedIcon,
  uncheckedIcon,
  size = "lg",
  thumbClassName,
  ...props
}: IconSwitchProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultChecked);
  const checked = checkedProp ?? uncontrolled;
  const custom = checkedIcon !== undefined || uncheckedIcon !== undefined;

  return (
    <Switch
      size={size}
      checked={checked}
      onCheckedChange={(next) => {
        if (checkedProp === undefined) setUncontrolled(next);
        onCheckedChange?.(next);
      }}
      thumbClassName={cn(
        "data-[state=unchecked]:text-background data-[state=checked]:text-foreground [&_svg]:size-[70%]",
        thumbClassName
      )}
      thumbContent={
        custom ? (
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span key={checked ? "on" : "off"} className="grid size-full place-items-center" {...swap}>
              {checked ? checkedIcon : uncheckedIcon}
            </motion.span>
          </AnimatePresence>
        ) : (
          <SunMoonIcon moon={checked} />
        )
      }
      {...props}
    />
  );
}
