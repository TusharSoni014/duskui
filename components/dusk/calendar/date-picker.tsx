"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { format as formatDate } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import type { Matcher } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar, type CalendarProps } from "@/components/ui/calendar";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface DatePickerProps
  extends Omit<React.ComponentProps<typeof Button>, "value" | "defaultValue" | "onChange" | "children" | "disabled"> {
  value?: Date;
  defaultValue?: Date;
  /** Called with the picked date, or undefined when it is cleared by clicking it again. */
  onValueChange?: (date: Date | undefined) => void;
  /** Trigger text when no date is picked. */
  placeholder?: string;
  /** date-fns format string for the trigger. Default "PPP" (e.g. June 12, 2026). */
  dateFormat?: string;
  /** Days that can't be picked, e.g. `{ before: today }`. */
  disabledDays?: Matcher | Matcher[];
  /** Disable the whole picker. */
  disabled?: boolean;
  /** Form field name. The date is submitted as yyyy-MM-dd in a hidden input. */
  name?: string;
  /** Extra props for the Calendar (e.g. `startMonth`, `captionLayout`, `today`). */
  calendarProps?: Omit<Extract<CalendarProps, { mode: "single" }>, "mode" | "selected" | "onSelect" | "required">;
  /** Classes for the floating panel. `className` styles the trigger. */
  contentClassName?: string;
}

/**
 * A date picker: an outline trigger that opens the DuskUI Calendar in a
 * popover. The panel scales out of the trigger, the formatted date rolls in
 * when it changes, and the calendar's selected pill glides between days. The
 * popover closes on pick and focus returns to the trigger. Radix handles
 * focus, Escape and outside clicks; react-day-picker handles the keyboard
 * grid. Under reduced motion it fades only.
 */
export function DatePicker({
  value: valueProp,
  defaultValue,
  onValueChange,
  placeholder = "Pick a date",
  dateFormat = "PPP",
  disabledDays,
  disabled,
  name,
  calendarProps,
  className,
  contentClassName,
  ...props
}: DatePickerProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [uncontrolled, setUncontrolled] = React.useState<Date | undefined>(defaultValue);
  const [open, setOpen] = React.useState(false);
  const value = valueProp !== undefined ? valueProp : uncontrolled;
  const label = value ? formatDate(value, dateFormat) : placeholder;

  const select = (date: Date | undefined) => {
    if (valueProp === undefined) setUncontrolled(date);
    onValueChange?.(date);
    if (date) setOpen(false);
  };

  const surface: Variants = reduceMotion
    ? { closed: { opacity: 0, transition: { duration: 0.1 } }, open: { opacity: 1, transition: { duration: 0.15 } } }
    : {
        closed: { opacity: 0, scale: 0.96, y: -4, transition: { duration: 0.12, ease: "easeIn" } },
        open: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", duration: 0.25, bounce: 0 } },
      };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full min-w-56 justify-start gap-2 px-3 font-normal hover:border-ring/40",
            open && "border-ring/60 ring-[3px] ring-ring/15",
            className
          )}
          {...props}
        >
          <CalendarIcon aria-hidden className={cn("text-muted-foreground transition-colors", (open || value) && "text-foreground")} />
          <span className="relative flex min-w-0 flex-1 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={label}
                className={cn("truncate", !value && "text-muted-foreground")}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ type: "spring", duration: 0.25, bounce: 0 }}
              >
                {label}
              </motion.span>
            </AnimatePresence>
          </span>
        </Button>
      </PopoverTrigger>

      {name && <input type="hidden" name={name} value={value ? formatDate(value, "yyyy-MM-dd") : ""} />}

      <AnimatePresence>
        {open && (
          // forceMount hands mounting to AnimatePresence so the exit animation can play.
          <PopoverPrimitive.Portal key="date-picker" forceMount>
            <PopoverPrimitive.Content forceMount asChild align="start" sideOffset={6}>
              <motion.div
                variants={surface}
                initial="closed"
                animate="open"
                exit="closed"
                className={cn(
                  "z-50 w-auto overflow-hidden rounded-xl border bg-popover text-popover-foreground outline-none",
                  "origin-(--radix-popover-content-transform-origin)",
                  "shadow-lg",
                  contentClassName
                )}
              >
                <Calendar
                  {...calendarProps}
                  mode="single"
                  selected={value}
                  onSelect={select}
                  defaultMonth={calendarProps?.defaultMonth ?? value}
                  disabled={disabledDays}
                  autoFocus
                />
              </motion.div>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        )}
      </AnimatePresence>
    </Popover>
  );
}
