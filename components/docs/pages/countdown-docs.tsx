import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import CountdownDemo from "@/components/demos/countdown/countdown-demo";
import CountdownFlip from "@/components/demos/countdown/countdown-flip";
import CountdownCompact from "@/components/demos/countdown/countdown-compact";
import CountdownComplete from "@/components/demos/countdown/countdown-complete";

const demo = (file: string) => `components/demos/countdown/${file}`;

const config: DocConfig = {
  title: "Countdown",
  intro:
    "An animated countdown timer for React: days, hours, minutes and seconds to any date, with digits that roll or flip as they change. Includes a compact inline variant, an onComplete callback and screen reader announcements throttled to once a minute. Hydration-safe for Next.js.",
  tags: ["Roll & flip digits", "Compact variant", "onComplete", "Hydration-safe", "Throttled announcements", "Reduced-motion safe"],
  hero: { Demo: CountdownDemo, file: demo("countdown-demo.tsx"), minHeight: 320 },
  install: {
    registry: "countdown",
    source: "components/dusk/countdown/countdown.tsx",
    deps: "motion",
    note: (
      <>
        The server never knows the visitor&apos;s clock, so the server render shows dashes and the digits start ticking
        right after hydration. Pass a fixed date (an ISO string with a timezone offset is safest), or pass{" "}
        <Code>null</Code> while you compute one in an effect.
      </>
    ),
  },
  usage: {
    filename: "launch.tsx",
    code: `import { Countdown } from "@/components/dusk/countdown/countdown"

export function Launch() {
  return <Countdown target="2027-01-01T00:00:00Z" label="Time until launch" />
}`,
  },
  examples: [
    {
      id: "flip",
      title: "Flip animation",
      description: (
        <>
          <Code>animation=&quot;flip&quot;</Code> turns each digit over like a drum. <Code>units</Code> picks what to
          show; the largest unit absorbs the rest, so hours can go past 24 here.
        </>
      ),
      Demo: CountdownFlip,
      file: demo("countdown-flip.tsx"),
      minHeight: 260,
    },
    {
      id: "compact",
      title: "Compact",
      description: (
        <>
          <Code>variant=&quot;compact&quot;</Code> fits on one line, in banners and buttons. Short labels (d, h, m, s) are
          the default; override them with <Code>labels</Code>.
        </>
      ),
      Demo: CountdownCompact,
      file: demo("countdown-compact.tsx"),
      minHeight: 160,
    },
    {
      id: "complete",
      title: "Completion",
      description: (
        <>
          <Code>onComplete</Code> fires once when the timer hits zero, and <Code>completed</Code> replaces the digits.
          Changing <Code>target</Code> to a future time starts it again.
        </>
      ),
      Demo: CountdownComplete,
      file: demo("countdown-complete.tsx"),
      minHeight: 280,
    },
  ],
  api: {
    intro: (
      <>
        Any other <Code>div</Code> prop is passed to the root. Every countdown on the page shares one timer aligned to
        the second, so many timers stay in sync and cost almost nothing.
      </>
    ),
    props: [
      { name: "target", type: "Date | number | string | null", description: "When it ends. null keeps the placeholders." },
      { name: "units", type: '("days" | "hours" | "minutes" | "seconds")[]', default: "all four", description: "Units to show; the largest absorbs the rest." },
      { name: "labels", type: "Partial<Record<Unit, string>>", description: "Text per unit. Defaults to Days/Hours… or d/h… when compact." },
      { name: "variant", type: '"default" | "compact"', default: '"default"', description: "Boxed digits with labels, or one inline line." },
      { name: "animation", type: '"roll" | "flip"', default: '"roll"', description: "How a digit changes." },
      { name: "onComplete", type: "() => void", description: "Called once at zero (also on mount if the target has passed)." },
      { name: "completed", type: "ReactNode", description: "Rendered instead of the digits when it's over." },
      { name: "label", type: "string", default: '"Countdown"', description: "Accessible name of the timer." },
      { name: "completeText", type: "string", default: '"Countdown finished"', description: "Announced when it ends." },
      { name: "unitClassName", type: "string", description: "Classes for each unit's box." },
    ],
  },
  accessibility: [
    "The ticking digits are hidden from screen readers; a polite live region reads the time left instead.",
    'That announcement is rounded to the minute ("2 days, 3 hours, 12 minutes remaining"), so it changes at most once a minute instead of every second.',
    "The group has an accessible name via label, and completeText is announced when it ends.",
    "With prefers-reduced-motion digits crossfade instead of rolling or flipping.",
    "Digits sit in fixed-width tabular slots, so nothing around the timer shifts as it counts.",
  ],
};

export function CountdownDocs() {
  return <ComponentDocs config={config} />;
}
