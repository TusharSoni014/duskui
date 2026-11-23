"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { StepperProgress } from "@/components/dusk/progress/stepper-progress";

const steps = [
  { title: "Account", description: "Email & password" },
  { title: "Workspace", description: "Name your team" },
  { title: "Invite", description: "Add teammates" },
  { title: "Launch", description: "You're live" },
];

export default function StepperProgressDemo() {
  const [current, setCurrent] = React.useState(1);

  return (
    <div className="flex w-full max-w-xl flex-col gap-8">
      <StepperProgress steps={steps} current={current} label="Onboarding progress" />
      <div className="flex justify-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}>
          Back
        </Button>
        <Button size="sm" onClick={() => setCurrent((c) => Math.min(steps.length, c + 1))} disabled={current === steps.length}>
          {current >= steps.length - 1 ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
}
