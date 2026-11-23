"use client";

import * as React from "react";
import { Flag, Lightbulb, PenTool, Rocket, TestTube } from "lucide-react";

import { Timeline, TimelineItem } from "@/components/dusk/timeline/timeline";

const steps = [
  { icon: Lightbulb, date: "Week 1", title: "Discovery", body: "Interview ten customers and map the jobs they hire the product for." },
  { icon: PenTool, date: "Week 2–3", title: "Design", body: "Wireframes, a clickable prototype and a round of hallway tests." },
  { icon: TestTube, date: "Week 4–6", title: "Build & test", body: "Ship behind a flag to 5% of users and watch the metrics." },
  { icon: Rocket, date: "Week 7", title: "Launch", body: "Flip the flag, publish the changelog and post it in the changelog." },
  { icon: Flag, date: "Week 8", title: "Review", body: "Measure against the goals we set in week one and decide what's next." },
];

export default function TimelineRoadmapDemo() {
  const scroller = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scroller}
      tabIndex={0}
      aria-label="Roadmap, scrollable"
      className="relative h-96 w-full max-w-md overflow-y-auto rounded-xl border border-white/10 bg-black/30 px-6 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 [scrollbar-width:thin]"
    >
      <div className="h-24" />
      <Timeline container={scroller} anchor={0.7}>
        {steps.map(({ icon: Icon, date, title, body }) => (
          <TimelineItem key={title} date={date} title={title} icon={<Icon />}>
            {body}
          </TimelineItem>
        ))}
      </Timeline>
      <div className="h-56" />
    </div>
  );
}
