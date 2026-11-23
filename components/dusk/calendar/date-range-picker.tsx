"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  addMonths,
  differenceInCalendarDays,
  endOfMonth,
  format as formatDate,
  isAfter,
  isSameDay,
  startOfDay,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
} from "date-fns";
import { CalendarRangeIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, type Transition, type Variants } from "motion/react";
import type { DateRange, Matcher } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar, type CalendarProps } from "@/components/ui/calendar";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type { DateRange };

export interface DateRangePreset {
  label: string;
  /** Returns the range for this preset, given today's date (start of day). */
  getRange: (today: Date) => { from: Date; to: Date };
}

export const defaultRangePresets: DateRangePreset[] = [
  { label: "Today", getRange: (t) => ({ from: t, to: t }) },
  { label: "Yesterday", getRange: (t) => ({ from: subDays(t, 1), to: subDays(t, 1) }) },
  { label: "Last 7 days", getRange: (t) => ({ from: subDays(t, 6), to: t }) },
  { label: "Last 30 days", getRange: (t) => ({ from: subDays(t, 29), to: t }) },
  { label: "This month", getRange: (t) => ({ from: startOfMonth(t), to: t }) },
  { label: "Last month", getRange: (t) => ({ from: startOfMonth(subMonths(t, 1)), to: endOfMonth(subMonths(t, 1)) }) },
  { label: "Year to date", getRange: (t) => ({ from: startOfYear(t), to: t }) },
];

export interface DateRangePickerProps
  extends Omit<React.ComponentProps<typeof Button>, "value" | "defaultValue" | "onChange" | "children" | "disabled"> {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  /** date-fns format string for each end of the range. Default "LLL d, y" (e.g. Jun 12, 2026). */
  dateFormat?: string;
  /** Quick ranges in the side panel. Pass `[]` to hide the panel. */
  presets?: DateRangePreset[];
  /** Months shown side by side (stacked on small screens). Default 2. */
  numberOfMonths?: number;
  /** "Today" for the presets and the calendar. Defaults to the current date when the picker opens. */
  today?: Date;
  /** Days that can't be picked. */
  disabledDays?: Matcher | Matcher[];
  disabled?: boolean;
  /** Extra props for the Calendar. */
  calendarProps?: Omit<
    Extract<CalendarProps, { mode: "range" }>,
    "mode" | "selected" | "onSelect" | "required" | "month" | "onMonthChange" | "numberOfMonths"
  >;
  /** Classes for the floating panel. `className` styles the trigger. */
  contentClassName?: string;
}

const pillSpring: Transition = { type: "spring", stiffness: 520, damping: 38, mass: 0.6 };

/** The first visible month that still shows `range.to` in the last column. */
function monthFor(range: { from: Date; to: Date }, months: number) {
  const fromMonth = startOfMonth(range.from);
  const lastFit = addMonths(startOfMonth(range.to), -(months - 1));
  return isAfter(lastFit, fromMonth) ? lastFit : fromMonth;
}

/**
 * A date range picker with presets. The trigger opens a popover with quick
 * ranges ("Last 7 days", "This month"…) next to a two-month DuskUI Calendar.
 * A highlight pill glides to the active preset, picking a preset slides the
 * calendar to that range in the right direction, and the trigger text rolls
 * to the new range. A footer shows the length of the range with Clear and
 * Done. Under reduced motion everything fades or jumps instead.
 */
export function DateRangePicker({
  value: valueProp,
  defaultValue,
  onValueChange,
  placeholder = "Pick a date range",
  dateFormat = "LLL d, y",
  presets = defaultRangePresets,
  numberOfMonths = 2,
  today: todayProp,
  disabledDays,
  disabled,
  calendarProps,
  className,
  contentClassName,
  ...props
}: DateRangePickerProps) {
  const id = React.useId();
  const reduceMotion = useReducedMotion() ?? false;
  const [uncontrolled, setUncontrolled] = React.useState<DateRange | undefined>(defaultValue);
  const [open, setOpen] = React.useState(false);
  // Resolved when the popover opens (an event), so nothing reads the clock during render.
  const [today, setToday] = React.useState<Date | undefined>(todayProp);
  const [month, setMonth] = React.useState<Date | undefined>(undefined);
  const value = valueProp !== undefined ? valueProp : uncontrolled;

  const label = value?.from
    ? value.to && !isSameDay(value.from, value.to)
      ? `${formatDate(value.from, dateFormat)} – ${formatDate(value.to, dateFormat)}`
      : formatDate(value.from, dateFormat)
    : placeholder;

  const commit = (range: DateRange | undefined) => {
    if (valueProp === undefined) setUncontrolled(range);
    onValueChange?.(range);
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) return;
    const now = startOfDay(todayProp ?? new Date());
    setToday(now);
    setMonth(value?.from && value.to ? monthFor({ from: value.from, to: value.to }, numberOfMonths) : value?.from ?? addMonths(now, -(numberOfMonths - 1)));
  };

  const applyPreset = (preset: DateRangePreset) => {
    if (!today) return;
    const range = preset.getRange(today);
    commit(range);
    setMonth(monthFor(range, numberOfMonths));
  };

  const activePreset =
    today && value?.from && value.to
      ? presets.find((p) => {
          const r = p.getRange(today);
          return isSameDay(r.from, value.from!) && isSameDay(r.to, value.to!);
        })
      : undefined;

  const days = value?.from && value.to ? differenceInCalendarDays(value.to, value.from) + 1 : 0;

  const surface: Variants = reduceMotion
    ? { closed: { opacity: 0, transition: { duration: 0.1 } }, open: { opacity: 1, transition: { duration: 0.15 } } }
    : {
        closed: { opacity: 0, scale: 0.96, y: -4, transition: { duration: 0.12, ease: "easeIn" } },
        open: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", duration: 0.25, bounce: 0 } },
      };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full min-w-64 justify-start gap-2 px-3 font-normal hover:border-ring/40",
            open && "border-ring/60 ring-[3px] ring-ring/15",
            className
          )}
          {...props}
        >
          <CalendarRangeIcon aria-hidden className={cn("text-muted-foreground transition-colors", (open || value?.from) && "text-foreground")} />
          <span className="relative flex min-w-0 flex-1 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={label}
                className={cn("truncate", !value?.from && "text-muted-foreground")}
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

      <AnimatePresence>
        {open && (
          <PopoverPrimitive.Portal key="date-range-picker" forceMount>
            <PopoverPrimitive.Content forceMount asChild align="start" sideOffset={6} collisionPadding={8}>
              <motion.div
                variants={surface}
                initial="closed"
                animate="open"
                exit="closed"
                className={cn(
                  "z-50 max-h-(--radix-popover-content-available-height) max-w-[calc(100vw-1rem)] overflow-auto rounded-xl border bg-popover text-popover-foreground outline-none",
                  "origin-(--radix-popover-content-transform-origin)",
                  "shadow-lg",
                  contentClassName
                )}
              >
                <div className="flex flex-col sm:flex-row">
                  {presets.length > 0 && (
                    <div
                      role="group"
                      aria-label="Quick ranges"
                      className="flex gap-1 overflow-x-auto border-b p-2 sm:w-40 sm:flex-col sm:overflow-visible sm:border-r sm:border-b-0"
                    >
                      {presets.map((preset) => {
                        const active = preset === activePreset;
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            aria-pressed={active}
                            onClick={() => applyPreset(preset)}
                            className={cn(
                              "relative shrink-0 rounded-md px-2.5 py-1.5 text-left text-sm whitespace-nowrap text-muted-foreground outline-none",
                              "transition-colors duration-150 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50",
                              active && "text-foreground"
                            )}
                          >
                            {active && (
                              <motion.span
                                aria-hidden
                                layoutId={`${id}-preset`}
                                transition={reduceMotion ? { duration: 0 } : pillSpring}
                                className="absolute inset-0 rounded-md bg-accent"
                              />
                            )}
                            <span className="relative">{preset.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex flex-col">
                    <Calendar
                      {...calendarProps}
                      mode="range"
                      selected={value}
                      onSelect={commit}
                      month={month}
                      onMonthChange={setMonth}
                      numberOfMonths={numberOfMonths}
                      today={calendarProps?.today ?? today}
                      disabled={disabledDays}
                    />
                    <div className="flex items-center justify-between gap-3 border-t px-3 py-2.5">
                      <p aria-live="polite" className="text-xs text-muted-foreground tabular-nums">
                        {days > 0 ? `${days} ${days === 1 ? "day" : "days"} selected` : value?.from ? "Pick an end date" : "Pick a start date"}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          aria-disabled={!value?.from || undefined}
                          onClick={() => value?.from && commit(undefined)}
                        >
                          Clear
                        </Button>
                        <Button type="button" size="sm" onClick={() => setOpen(false)}>
                          Done
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        )}
      </AnimatePresence>
    </Popover>
  );
}
