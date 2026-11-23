"use client";

import * as React from "react";
import { Pause, Play } from "lucide-react";

import { Marquee } from "@/components/dusk/marquee/marquee";
import { Button } from "@/components/ui/button";

const reviews = [
  { name: "Maya Chen", handle: "@mayabuilds", text: "We rebuilt our pricing page sections in an afternoon and kept our own styles." },
  { name: "Leo Park", handle: "@leop", text: "Reduced motion is handled out of the box, which saved us an accessibility pass." },
  { name: "Ama Owusu", handle: "@ama.codes", text: "The components are plain React and Tailwind, so code review was quick." },
  { name: "Jonas Weber", handle: "@jweber", text: "The marquee loops cleanly at every width. No visible seams." },
  { name: "Priya Nair", handle: "@priyanair", text: "Focus states and keyboard support were already there when we checked." },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

function Review({ name, handle, text }: (typeof reviews)[number]) {
  return (
    <figure className="w-72 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex size-9 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground"
        >
          {initials(name)}
        </span>
        <figcaption className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{name}</p>
          <p className="truncate text-xs text-white/45">{handle}</p>
        </figcaption>
      </div>
      <blockquote className="mt-3 text-sm leading-relaxed text-white/70">{text}</blockquote>
    </figure>
  );
}

export default function MarqueeTestimonialsDemo() {
  const [paused, setPaused] = React.useState(false);

  return (
    <div className="w-full max-w-2xl space-y-4">
      <Marquee paused={paused} speed={32} fade={96} aria-label="Customer reviews" role="region">
        {reviews.map((review) => (
          <Review key={review.handle} {...review} />
        ))}
      </Marquee>
      <div className="flex justify-center">
        <Button variant="outline" size="sm" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
          {paused ? <Play aria-hidden /> : <Pause aria-hidden />}
          {paused ? "Play" : "Pause"}
        </Button>
      </div>
    </div>
  );
}
