"use client";

import * as React from "react";
import {
  DayPicker,
  type ChevronProps,
  type DayButtonProps,
  type DayPickerProps,
  type RootProps,
  type WeekNumberProps,
} from "react-day-picker";
import { format } from "date-fns";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { motion, useReducedMotion, type Transition } from "motion/react";

import { buttonVariants, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const pillSpring: Transition = { type: "spring", duration: 0.25, bounce: 0 };

/** Shared with the day buttons, so the selected pill can glide between days in single mode. */
const CalendarContext = React.createContext<{ pillId?: string }>({});

export type CalendarProps = DayPickerProps & {
  /** Button variant for the previous / next month buttons. */
  buttonVariant?: ButtonProps["variant"];
};

/**
 * DuskUI Calendar — the shadcn/ui Calendar rebuilt on react-day-picker v10.
 *
 * Same API as shadcn (every DayPicker prop, plus `buttonVariant`) with:
 * - A solid mint pill for the selected day. In `mode="single"` it glides
 *   from the old day to the new one (short, no overshoot).
 * - A neutral background for today, so it stays visible next to a selection.
 * - Range styles: solid caps on the start and end days joined by a neutral band.
 * - Month transitions: the weeks shift in slightly from the side you navigated
 *   toward while the caption crossfades (react-day-picker's `animate`, on by default).
 * - Styled month / year dropdowns for `captionLayout="dropdown"`.
 * - Under `prefers-reduced-motion` months crossfade without sliding and the
 *   pill jumps.
 * react-day-picker handles the grid semantics, roving focus and the full
 * keyboard model (arrows, Home/End, PageUp/PageDown, Shift+PageUp/Down).
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  animate = true,
  formatters,
  components,
  ...props
}: CalendarProps) {
  const id = React.useId();
  const context = React.useMemo(
    () => ({ pillId: props.mode === "single" ? `${id}-pill` : undefined }),
    [props.mode, id]
  );

  return (
    <CalendarContext.Provider value={context}>
      <DayPicker
        showOutsideDays={showOutsideDays}
        captionLayout={captionLayout}
        // Under reduced motion the months crossfade without sliding (see the
        // motion-reduce classes on month_caption and weeks), so the markup is the
        // same on the server and the client.
        animate={animate}
        className={cn(
          "group/calendar w-fit p-3 [--cell-size:--spacing(9)]",
          className
        )}
        formatters={{
          // Short month names from the calendar's own locale, identical on server and client.
          formatMonthDropdown: (date, dateLib) => (dateLib ? dateLib.format(date, "LLL") : format(date, "LLL")),
          ...formatters,
        }}
        classNames={{
          root: "w-fit",
          months: "relative flex flex-col gap-4 md:flex-row",
          month: "flex w-full flex-col gap-4",
          nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          button_previous: cn(
            buttonVariants({ variant: buttonVariant }),
            "size-(--cell-size) p-0 text-muted-foreground select-none hover:text-foreground aria-disabled:pointer-events-none aria-disabled:opacity-40"
          ),
          button_next: cn(
            buttonVariants({ variant: buttonVariant }),
            "size-(--cell-size) p-0 text-muted-foreground select-none hover:text-foreground aria-disabled:pointer-events-none aria-disabled:opacity-40"
          ),
          month_caption: cn(
            "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
            "duration-200 ease-out [--tw-animation-fill-mode:forwards]",
            "motion-reduce:[--tw-enter-translate-x:0]! motion-reduce:[--tw-exit-translate-x:0]!",
            "[&.cal-caption-after-enter]:animate-in [&.cal-caption-after-enter]:fade-in-0 [&.cal-caption-after-enter]:slide-in-from-right-3",
            "[&.cal-caption-before-enter]:animate-in [&.cal-caption-before-enter]:fade-in-0 [&.cal-caption-before-enter]:slide-in-from-left-3",
            "[&.cal-caption-after-exit]:animate-out [&.cal-caption-after-exit]:fade-out-0 [&.cal-caption-after-exit]:slide-out-to-right-3",
            "[&.cal-caption-before-exit]:animate-out [&.cal-caption-before-exit]:fade-out-0 [&.cal-caption-before-exit]:slide-out-to-left-3"
          ),
          dropdowns: "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
          dropdown_root: cn(
            "relative rounded-md border border-input bg-input/30 shadow-xs transition-[border-color,box-shadow] duration-150",
            "has-focus:border-ring has-focus:ring-[3px] has-focus:ring-ring/50"
          ),
          dropdown: "absolute inset-0 cursor-pointer bg-popover opacity-0",
          caption_label: cn(
            "font-medium select-none",
            captionLayout === "label"
              ? "text-sm"
              : "flex h-8 items-center gap-1 rounded-md pr-1.5 pl-2.5 text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground"
          ),
          month_grid: "w-full border-collapse",
          weekdays: "flex",
          weekday: "flex-1 rounded-md text-[0.8rem] font-normal text-muted-foreground select-none",
          weeks: cn(
            "duration-200 ease-out [--tw-animation-fill-mode:forwards]",
            "motion-reduce:[--tw-enter-translate-x:0]! motion-reduce:[--tw-exit-translate-x:0]!",
            "[&.cal-weeks-after-enter]:animate-in [&.cal-weeks-after-enter]:fade-in-0 [&.cal-weeks-after-enter]:slide-in-from-right-2",
            "[&.cal-weeks-before-enter]:animate-in [&.cal-weeks-before-enter]:fade-in-0 [&.cal-weeks-before-enter]:slide-in-from-left-2",
            "[&.cal-weeks-after-exit]:animate-out [&.cal-weeks-after-exit]:fade-out-0 [&.cal-weeks-after-exit]:slide-out-to-right-2",
            "[&.cal-weeks-before-exit]:animate-out [&.cal-weeks-before-exit]:fade-out-0 [&.cal-weeks-before-exit]:slide-out-to-left-2"
          ),
          week: "mt-1.5 flex w-full",
          week_number_header: "w-(--cell-size) select-none",
          week_number: "text-[0.8rem] text-muted-foreground select-none",
          day: cn(
            "group/day relative aspect-square h-full w-full p-0 text-center select-none",
            "[&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md"
          ),
          range_start: "rounded-l-md bg-accent",
          range_middle: "rounded-none bg-accent first:rounded-l-md last:rounded-r-md",
          range_end: "rounded-r-md bg-accent",
          today: "",
          outside: "text-muted-foreground/60 aria-selected:text-muted-foreground",
          disabled: "text-muted-foreground opacity-40",
          hidden: "invisible",
          // Single-token marker classes that react-day-picker adds while a month slides.
          weeks_after_enter: "cal-weeks-after-enter",
          weeks_before_enter: "cal-weeks-before-enter",
          weeks_after_exit: "cal-weeks-after-exit",
          weeks_before_exit: "cal-weeks-before-exit",
          caption_after_enter: "cal-caption-after-enter",
          caption_before_enter: "cal-caption-before-enter",
          caption_after_exit: "cal-caption-after-exit",
          caption_before_exit: "cal-caption-before-exit",
          ...classNames,
        }}
        components={{
          Root: CalendarRoot,
          Chevron: CalendarChevron,
          DayButton: CalendarDayButton,
          WeekNumber: CalendarWeekNumber,
          ...components,
        }}
        {...props}
      />
    </CalendarContext.Provider>
  );
}

function CalendarRoot({ className, rootRef, ...props }: RootProps) {
  return <div data-slot="calendar" ref={rootRef} className={className} {...props} />;
}

function CalendarChevron({ className, orientation, disabled, style }: ChevronProps) {
  const Icon =
    orientation === "left" ? ChevronLeftIcon : orientation === "right" ? ChevronRightIcon : ChevronDownIcon;
  return <Icon aria-hidden data-disabled={disabled || undefined} style={style} className={cn("size-4", className)} />;
}

function CalendarWeekNumber({ children, week, ...props }: WeekNumberProps) {
  return (
    <td data-week={week.weekNumber} {...props}>
      <div className="flex size-(--cell-size) items-center justify-center text-center">{children}</div>
    </td>
  );
}

/** A day. Focus follows react-day-picker's roving focus; the selected pill is a separate layer. */
function CalendarDayButton({ className, day, modifiers, children, ...props }: DayButtonProps) {
  const { pillId } = React.useContext(CalendarContext);
  const reduceMotion = useReducedMotion() ?? false;
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const selectedSingle =
    modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle;
  // Only an in-month day may own the shared pill, so a date shown twice (as an
  // outside day of the next month) never renders two pills with one id.
  const sharedPill = selectedSingle && pillId && !day.outside ? pillId : undefined;

  return (
    <button
      ref={ref}
      data-selected-single={selectedSingle || undefined}
      data-range-start={modifiers.range_start || undefined}
      data-range-end={modifiers.range_end || undefined}
      data-range-middle={modifiers.range_middle || undefined}
      data-today={(modifiers.today && !modifiers.outside && !modifiers.selected) || undefined}
      className={cn(
        "relative isolate flex aspect-square size-auto w-full min-w-(--cell-size) items-center justify-center rounded-md text-sm leading-none font-normal tabular-nums outline-none",
        "transition-[color,background-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:z-20 focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "disabled:pointer-events-none aria-disabled:pointer-events-none",
        // Today: a neutral background that stays visible next to a selection.
        "data-today:bg-accent data-today:text-accent-foreground",
        // Selected single / multiple day: the pill layer paints the background.
        "data-selected-single:text-primary-foreground data-selected-single:hover:bg-transparent data-selected-single:hover:text-primary-foreground",
        // Range caps and band.
        "data-range-start:bg-primary data-range-start:text-primary-foreground data-range-start:hover:bg-primary/90",
        "data-range-end:bg-primary data-range-end:text-primary-foreground data-range-end:hover:bg-primary/90",
        "data-range-middle:rounded-none data-range-middle:bg-transparent data-range-middle:text-foreground data-range-middle:hover:bg-white/5",
        className
      )}
      {...props}
    >
      {selectedSingle && (
        <motion.span
          aria-hidden
          layoutId={sharedPill}
          transition={reduceMotion ? { duration: 0 } : pillSpring}
          className="absolute inset-0 -z-10 rounded-md bg-primary"
        />
      )}
      {children}
    </button>
  );
}

export { Calendar, CalendarDayButton };
