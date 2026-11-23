"use client";

import { Quote } from "lucide-react";

import { CardStack } from "@/components/dusk/card-stack/card-stack";

const testimonials = [
  { name: "Ava Chen", role: "Design lead, Northwind", quote: "We replaced three carousel libraries with this. Swiping feels native on every phone we tested." },
  { name: "Marcus Webb", role: "Founder, Lumen", quote: "The springs are tuned so well that our onboarding finally feels as polished as the product." },
  { name: "Priya Raman", role: "Staff engineer, Orbit", quote: "Keyboard support and the live announcements made our accessibility review a non-event." },
  { name: "Jonas Berg", role: "PM, Fjord", quote: "Drop it in, pass an array, done. It handled our 200-card deck without breaking a sweat." },
  { name: "Lea Martin", role: "Indie developer", quote: "Reduced motion turns it into a calm crossfade. My users with vestibular issues noticed." },
];

export default function CardStackDemo() {
  return (
    <div className="flex w-full justify-center rounded-xl border border-white/10 bg-background px-6 py-10">
      <CardStack
        items={testimonials}
        getKey={(t) => t.name}
        label="Testimonials"
        cardClassName="p-6"
        renderItem={(t) => (
          <figure className="flex h-52 flex-col">
            <Quote aria-hidden className="size-5 text-white/30" />
            <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-white/80">{t.quote}</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span
                aria-hidden
                className="flex size-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-foreground"
              >
                {t.name.split(" ").map((n) => n[0]).join("")}
              </span>
              <span>
                <span className="block text-sm font-medium text-white">{t.name}</span>
                <span className="block text-xs text-white/50">{t.role}</span>
              </span>
            </figcaption>
          </figure>
        )}
      />
    </div>
  );
}
