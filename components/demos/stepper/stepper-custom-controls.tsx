"use client";

import { ChevronLeft, ChevronRight, Command, Globe, Keyboard, MousePointer2 } from "lucide-react";

import { Stepper, StepperPanel, StepperPanels, useStepper } from "@/components/dusk/stepper/stepper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const slides = [
  { title: "Command menu", body: "Press ⌘K anywhere to jump to a page, run an action or search your docs.", icon: Command },
  { title: "Live cursors", body: "See teammates move through the canvas in real time, each labelled with their name.", icon: MousePointer2 },
  { title: "Instant previews", body: "Every branch gets a URL. Share it before you merge.", icon: Globe },
  { title: "Keyboard first", body: "Every action has a shortcut. Hold ? to see them all.", icon: Keyboard },
];

function TourControls() {
  const { index, count, steps, goTo, back, next, isFirst, isLast } = useStepper();
  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" size="icon-sm" onClick={back} disabled={isFirst} aria-label="Previous tip">
        <ChevronLeft aria-hidden />
      </Button>
      <div className="flex gap-1.5">
        {steps.map((step, i) => (
          <button
            key={step.title}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Tip ${i + 1} of ${count}: ${step.title}`}
            aria-current={i === index ? "step" : undefined}
            className={cn(
              "h-1.5 rounded-full outline-none transition-[width,background-color] duration-300 focus-visible:ring-[3px] focus-visible:ring-ring/50 motion-reduce:transition-none",
              i === index ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground"
            )}
          />
        ))}
      </div>
      <Button variant="ghost" size="icon-sm" onClick={() => void next()} disabled={isLast} aria-label="Next tip">
        <ChevronRight aria-hidden />
      </Button>
    </div>
  );
}

export default function StepperCustomControlsDemo() {
  return (
    <Stepper steps={slides} linear={false} className="max-w-sm gap-4 rounded-xl border bg-card p-4">
      <StepperPanels>
        {slides.map((slide, i) => (
          <StepperPanel key={slide.title} index={i}>
            <span aria-hidden className="mb-4 grid size-10 place-items-center rounded-md border bg-muted text-muted-foreground">
              <slide.icon className="size-5" />
            </span>
            <h3 className="font-medium">{slide.title}</h3>
            <p className="mt-1 min-h-10 text-sm text-muted-foreground">{slide.body}</p>
          </StepperPanel>
        ))}
      </StepperPanels>
      <TourControls />
    </Stepper>
  );
}
