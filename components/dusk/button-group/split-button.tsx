"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface SplitButtonAction {
  value: string;
  label: string;
  /** Shown under the label in the menu. */
  description?: string;
  /** Leading icon element, shown on the button and in the menu. */
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SplitButtonProps {
  actions: SplitButtonAction[];
  /** The action the main button runs (controlled). */
  value?: string;
  defaultValue?: string;
  /** Fires when a different action is picked from the menu. */
  onValueChange?: (value: string) => void;
  /** Fires when the main button is clicked, with the current action. */
  onAction?: (value: string) => void;
  variant?: "default" | "secondary" | "outline";
  size?: "sm" | "default" | "lg";
  /** Spinner on the main button; the menu stays usable. */
  loading?: boolean;
  disabled?: boolean;
  /** Accessible name of the menu button. */
  menuLabel?: string;
  className?: string;
}

const swap: Transition = { type: "spring", duration: 0.35, bounce: 0 };

/** Tracks an element's width so a wrapper can spring to it. */
function useWidth(ref: React.RefObject<HTMLElement | null>) {
  const [width, setWidth] = React.useState<number | "auto">("auto");
  React.useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.borderBoxSize?.[0]?.inlineSize ?? element.offsetWidth);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}

/**
 * A split button: a primary action joined to a menu of alternatives, like
 * "Merge pull request ▾". Picking another option makes it the main action —
 * its label rolls in while the button springs to the new width — and the
 * chevron flips while the menu is open. Built on the DuskUI Button, Button
 * Group and Dropdown Menu, so keyboard, focus and aria come from Radix.
 */
export function SplitButton({
  actions,
  value: valueProp,
  defaultValue,
  onValueChange,
  onAction,
  variant = "default",
  size = "default",
  loading = false,
  disabled = false,
  menuLabel = "More options",
  className,
}: SplitButtonProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? actions[0]?.value ?? "");
  const [open, setOpen] = React.useState(false);
  const value = valueProp ?? uncontrolled;
  const current = actions.find((action) => action.value === value) ?? actions[0];
  const measureRef = React.useRef<HTMLSpanElement>(null);
  const width = useWidth(measureRef);

  const select = (next: string) => {
    if (valueProp === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };

  const filled = variant !== "outline";

  return (
    <ButtonGroup className={className}>
      <Button
        variant={variant}
        size={size}
        loading={loading}
        disabled={disabled}
        onClick={() => current && onAction?.(current.value)}
      >
        <motion.span
          className="inline-flex overflow-hidden"
          initial={false}
          animate={{ width }}
          transition={reduceMotion ? { duration: 0 } : swap}
        >
          <span ref={measureRef} className="relative inline-flex items-center gap-2 whitespace-nowrap">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={current?.value}
                className="inline-flex items-center gap-2"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, filter: "blur(2px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, filter: "blur(2px)" }}
                transition={swap}
              >
                {current?.icon}
                {current?.label}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.span>
      </Button>
      {filled && <ButtonGroupSeparator className="bg-black/25" />}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={size === "sm" ? "icon-sm" : size === "lg" ? "icon-lg" : "icon"}
            disabled={disabled}
            aria-label={menuLabel}
          >
            <ChevronDownIcon
              className={cn(
                "transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                open && "rotate-180"
              )}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuRadioGroup value={value} onValueChange={select}>
            {actions.map((action) => (
              <DropdownMenuRadioItem
                key={action.value}
                value={action.value}
                disabled={action.disabled}
                className="items-start py-2"
              >
                <span className="grid gap-0.5">
                  <span className="flex items-center gap-2 font-medium">
                    {action.icon}
                    {action.label}
                  </span>
                  {action.description && (
                    <span className="text-xs leading-snug text-muted-foreground">{action.description}</span>
                  )}
                </span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
