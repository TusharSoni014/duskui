"use client";

import * as React from "react";
import { Pause, Play, Star } from "lucide-react";

import { Marquee } from "@/components/dusk/marquee/marquee";
import { Button } from "@/components/ui/button";

const reviews = [
  { name: "Maya Chen", handle: "@mayabuilds", hue: 160, text: "Swapped our landing page sections in an afternoon. The motion feels expensive." },
  { name: "Leo Park", handle: "@leop", hue: 200, text: "Finally a component library that respects reduced motion out of the box." },
  { name: "Ama Owusu", handle: "@ama.codes", hue: 280, text: "Copy, paste, ship. Our conversion page has never looked this alive." },
  { name: "Jonas Weber", handle: "@jweber", hue: 30, text: "The marquee loops perfectly at every width. No more janky seams." },
  { name: "Priya Nair", handle: "@priyanair", hue: 330, text: "Dark theme done right. Every hover state feels intentional." },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

function Review({ name, handle, hue, text }: (typeof reviews)[number]) {
  return (
    <figure className="w-72 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex size-9 items-center justify-center rounded-full text-xs font-semibold text-black"
          style={{ background: `linear-gradient(135deg, oklch(0.85 0.15 ${hue}), oklch(0.65 0.18 ${hue + 40}))` }}
        >
          {initials(name)}
        </span>
        <figcaption className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{name}</p>
          <p className="truncate text-xs text-white/45">{handle}</p>
        </figcaption>
        <span role="img" aria-label="5 out of 5 stars" className="ml-auto flex text-primary">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} aria-hidden className="size-3 fill-current" />
          ))}
        </span>
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
