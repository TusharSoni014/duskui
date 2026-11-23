"use client";

import * as React from "react";
import { useInView } from "motion/react";
import { CreditCard, GitPullRequest, MessageCircle, Pause, Play, Star, UserPlus } from "lucide-react";

import { AnimatedList, useListStream } from "@/components/dusk/animated-list/animated-list";
import { Button } from "@/components/ui/button";

const notifications = [
  { icon: CreditCard, title: "Payment received", body: "$249.00 from Northwind Labs" },
  { icon: UserPlus, title: "New sign-up", body: "maya@orbit.dev joined your workspace" },
  { icon: MessageCircle, title: "New comment", body: "Leo: “Ship it, looks great on mobile.”" },
  { icon: GitPullRequest, title: "Pull request merged", body: "#482 Add bento grid to landing page" },
  { icon: Star, title: "New review", body: "Priya rated your app 5 stars" },
];

function Notification({ icon: Icon, title, body }: (typeof notifications)[number]) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-card p-3">
      <span
        aria-hidden
        className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-white/70"
      >
        <Icon className="size-4.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-sm font-medium text-white">
          {title}
          <span className="text-xs font-normal text-white/55">· just now</span>
        </p>
        <p className="truncate text-sm text-white/55">{body}</p>
      </div>
    </div>
  );
}

export default function AnimatedListDemo() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [paused, setPaused] = React.useState(false);
  const { items } = useListStream(notifications, { initial: 3, interval: 2400, paused: paused || !inView });

  return (
    <div ref={ref} className="flex w-full max-w-sm flex-col gap-4">
      {/* Fixed height: room for exactly `max` items, so the page never shifts. */}
      <div className="h-[19rem] overflow-hidden">
        <AnimatedList max={4} announcePrefix="New notification:" aria-label="Notifications">
          {items.map(({ id, item }) => (
            <Notification key={id} {...item} />
          ))}
        </AnimatedList>
      </div>
      <Button variant="outline" size="sm" className="self-center" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
        {paused ? <Play aria-hidden /> : <Pause aria-hidden />}
        {paused ? "Resume stream" : "Pause stream"}
      </Button>
    </div>
  );
}
