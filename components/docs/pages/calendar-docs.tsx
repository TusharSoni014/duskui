import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import CalendarBasicDemo from "@/components/demos/calendar/calendar-basic";
import CalendarRangeDemo from "@/components/demos/calendar/calendar-range";
import CalendarDropdownDemo from "@/components/demos/calendar/calendar-dropdown";
import CalendarDisabledDemo from "@/components/demos/calendar/calendar-disabled";
import DatePickerDemo from "@/components/demos/calendar/date-picker-demo";
import DateRangePickerDemo from "@/components/demos/calendar/date-range-picker-demo";

const demo = (file: string) => `components/demos/calendar/${file}`;
const block = (file: string) => `components/dusk/calendar/${file}`;

const config: DocConfig = {
  title: "Calendar",
  intro:
    "An animated React calendar built on react-day-picker v10 and shadcn/ui — a gliding selected-day pill, a today ring, range styles and months that slide in the direction you navigate — plus a date picker and a date range picker with presets, built with Radix Popover and Motion.",
  tags: ["shadcn API", "react-day-picker v10", "Keyboard grid", "date-fns", "prefers-reduced-motion"],
  hero: { Demo: CalendarBasicDemo, file: demo("calendar-basic.tsx"), minHeight: 400 },
  install: {
    registry: "calendar",
    source: "components/ui/calendar.tsx",
    deps: "react-day-picker date-fns motion lucide-react",
    note: (
      <>
        Built for react-day-picker v10. Every DayPicker prop works, plus <Code>buttonVariant</Code> for
        the month buttons. Month transitions use DayPicker&apos;s <Code>animate</Code> prop, on by
        default; pass <Code>animate={"{false}"}</Code> to turn them off. To avoid hydration mismatches,
        pass fixed <Code>today</Code> and <Code>defaultMonth</Code> dates when a calendar is rendered on
        the server.
      </>
    ),
  },
  usage: {
    filename: "booking.tsx",
    code: `"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"

export function Booking() {
  const [date, setDate] = React.useState<Date | undefined>()

  return <Calendar mode="single" selected={date} onSelect={setDate} />
}`,
  },
  examples: [
    {
      id: "single",
      title: "Single date",
      description: (
        <>
          Pick a day and the mint pill glides over from the previous one. Today keeps a mint ring so you
          can always find it. Use the arrows (or PageUp / PageDown) to change month: the weeks slide in
          from the side you moved toward.
        </>
      ),
      Demo: CalendarBasicDemo,
      file: demo("calendar-basic.tsx"),
      minHeight: 400,
    },
    {
      id: "range",
      title: "Range",
      description: (
        <>
          <Code>mode=&quot;range&quot;</Code> draws solid caps on the first and last day joined by a tinted
          band. With <Code>numberOfMonths={"{2}"}</Code> the months sit side by side and stack on small
          screens.
        </>
      ),
      Demo: CalendarRangeDemo,
      file: demo("calendar-range.tsx"),
      minHeight: 420,
    },
    {
      id: "dropdown",
      title: "Month & year dropdowns",
      description: (
        <>
          <Code>captionLayout=&quot;dropdown&quot;</Code> swaps the caption for native month and year
          selects, styled to match. Set <Code>startMonth</Code> and <Code>endMonth</Code> to bound them —
          handy for birthdays.
        </>
      ),
      Demo: CalendarDropdownDemo,
      file: demo("calendar-dropdown.tsx"),
      minHeight: 400,
    },
    {
      id: "disabled",
      title: "Disabled days & week numbers",
      description: (
        <>
          Pass any react-day-picker matcher to <Code>disabled</Code> — here past days and weekends — and{" "}
          <Code>showWeekNumber</Code> for a week column. Disabled days are skipped by keyboard navigation.
        </>
      ),
      Demo: CalendarDisabledDemo,
      file: demo("calendar-disabled.tsx"),
      minHeight: 440,
    },
  ],
  blocks: [
    {
      id: "date-picker",
      title: "Date Picker",
      registry: "date-picker",
      source: block("date-picker.tsx"),
      deps: "@radix-ui/react-popover react-day-picker date-fns motion lucide-react",
      description: (
        <>
          A button that opens the Calendar in a popover. The panel springs out of the trigger, focus moves
          into the grid, and picking a day closes it and rolls the formatted date into the trigger. Pass{" "}
          <Code>name</Code> to submit the date in a form as <Code>yyyy-MM-dd</Code>.
        </>
      ),
      Demo: DatePickerDemo,
      file: demo("date-picker-demo.tsx"),
      minHeight: 220,
      props: [
        { name: "value / defaultValue", type: "Date | undefined", description: "Controlled or initial date." },
        { name: "onValueChange", type: "(date: Date | undefined) => void", description: "Called when a date is picked (or cleared by clicking it again)." },
        { name: "placeholder", type: "string", default: '"Pick a date"', description: "Trigger text when empty." },
        { name: "dateFormat", type: "string", default: '"PPP"', description: "date-fns format for the trigger." },
        { name: "disabledDays", type: "Matcher | Matcher[]", description: "Days that can't be picked, e.g. { before: today }." },
        { name: "name", type: "string", description: "Submits the date in a hidden input." },
        { name: "calendarProps", type: "CalendarProps", description: "Extra Calendar props such as today, defaultMonth, startMonth or captionLayout." },
        { name: "contentClassName", type: "string", description: "Classes for the popover panel. className styles the trigger." },
      ],
    },
    {
      id: "date-range-picker",
      title: "Date Range Picker",
      registry: "date-range-picker",
      source: block("date-range-picker.tsx"),
      deps: "@radix-ui/react-popover react-day-picker date-fns motion lucide-react",
      description: (
        <>
          Two months side by side with quick ranges — Today, Last 7 days, This month and more. A pill
          glides to the active preset, choosing one slides the calendar to that range, and a footer counts
          the days with Clear and Done. Bring your own presets with <Code>presets</Code>.
        </>
      ),
      Demo: DateRangePickerDemo,
      file: demo("date-range-picker-demo.tsx"),
      minHeight: 220,
      props: [
        { name: "value / defaultValue", type: "DateRange | undefined", description: "Controlled or initial range ({ from, to })." },
        { name: "onValueChange", type: "(range: DateRange | undefined) => void", description: "Called on every change." },
        { name: "presets", type: "{ label: string; getRange: (today: Date) => { from: Date; to: Date } }[]", default: "defaultRangePresets", description: "Quick ranges in the side panel. [] hides it." },
        { name: "numberOfMonths", type: "number", default: "2", description: "Months shown side by side." },
        { name: "today", type: "Date", description: "Reference date for presets. Defaults to the current date when the picker opens." },
        { name: "dateFormat", type: "string", default: '"LLL d, y"', description: "date-fns format for each end of the range." },
        { name: "disabledDays", type: "Matcher | Matcher[]", description: "Days that can't be picked." },
        { name: "calendarProps", type: "CalendarProps", description: "Extra Calendar props." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        <Code>Calendar</Code> forwards every{" "}
        <a href="https://daypicker.dev" className="text-primary hover:underline">react-day-picker</a> prop.
        The most used ones:
      </>
    ),
    props: [
      { name: "mode", type: '"single" | "multiple" | "range"', description: "Selection mode. In single mode the selected pill glides between days." },
      { name: "selected / onSelect", type: "Date | Date[] | DateRange", description: "The selection and its change handler." },
      { name: "today", type: "Date", description: "Overrides today. Pass a fixed date for server rendering." },
      { name: "month / defaultMonth / onMonthChange", type: "Date", description: "The displayed month, controlled or not." },
      { name: "numberOfMonths", type: "number", default: "1", description: "Months shown at once." },
      { name: "captionLayout", type: '"label" | "dropdown" | "dropdown-months" | "dropdown-years"', default: '"label"', description: "Caption text or month / year selects." },
      { name: "disabled", type: "Matcher | Matcher[]", description: "Days that can't be selected." },
      { name: "animate", type: "boolean", default: "true", description: "Slide months in the navigation direction. Off under reduced motion." },
      { name: "showOutsideDays", type: "boolean", default: "true", description: "Show days from the neighbouring months." },
      { name: "buttonVariant", type: "Button variant", default: '"ghost"', description: "Variant of the previous / next month buttons." },
    ],
  },
  accessibility: [
    <>react-day-picker renders a <Code>role=&quot;grid&quot;</Code> per month with labelled day buttons, <Code>aria-selected</Code> and a roving tab stop, so only one day is in the tab order.</>,
    <>Full keyboard support: arrow keys move by day and week, Home / End to the week edges, PageUp / PageDown by month and Shift+PageUp / PageDown by year. Disabled days are skipped.</>,
    <>The month caption is a polite live region, so changing month is announced. Month buttons have labels like &quot;Go to the Next Month&quot;.</>,
    <>The pickers use Radix Popover: focus moves into the calendar on open, Escape closes it and focus returns to the trigger.</>,
    "Under prefers-reduced-motion months swap instantly, the selected pill jumps and popovers only fade.",
  ],
};

export function CalendarDocs() {
  return <ComponentDocs config={config} />;
}
