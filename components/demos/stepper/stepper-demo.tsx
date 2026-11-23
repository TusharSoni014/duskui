"use client";

import * as React from "react";
import { PartyPopper } from "lucide-react";

import {
  Stepper,
  StepperCompleted,
  StepperControls,
  StepperNav,
  StepperPanel,
  StepperPanels,
  type StepperStepConfig,
} from "@/components/dusk/stepper/stepper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const plans = [
  { id: "hobby", name: "Hobby", price: "$0" },
  { id: "pro", name: "Pro", price: "$20" },
  { id: "team", name: "Team", price: "$60" },
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function StepperDemo() {
  const [email, setEmail] = React.useState("");
  const [workspace, setWorkspace] = React.useState("");
  const [plan, setPlan] = React.useState("pro");

  const steps: StepperStepConfig[] = [
    {
      title: "Account",
      description: "Your email",
      validate: () => /^\S+@\S+\.\S+$/.test(email) || "Enter a valid email address.",
    },
    {
      title: "Workspace",
      description: "Name your team",
      validate: async () => {
        if (workspace.trim().length < 3) return "Use at least 3 characters.";
        await wait(700); // Pretend to check availability.
        return workspace.trim().toLowerCase() === "admin" ? "That name is taken." : true;
      },
    },
    { title: "Plan", description: "Pick a tier" },
  ];

  return (
    <Stepper steps={steps} className="max-w-lg rounded-xl border bg-card p-6">
      <StepperNav label="Sign-up steps" />
      <StepperPanels>
        <StepperPanel index={0} className="space-y-2 p-1">
          <Label htmlFor="stepper-email">Work email</Label>
          <Input
            id="stepper-email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </StepperPanel>
        <StepperPanel index={1} className="space-y-2 p-1">
          <Label htmlFor="stepper-workspace">Workspace name</Label>
          <Input
            id="stepper-workspace"
            placeholder="night-shift"
            value={workspace}
            onChange={(e) => setWorkspace(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Try “admin” to see an async validation error.</p>
        </StepperPanel>
        <StepperPanel index={2} className="p-1">
          <fieldset>
            <legend className="mb-2 text-sm font-medium">Plan</legend>
            <div className="grid grid-cols-3 gap-2">
              {plans.map((p) => (
                <label
                  key={p.id}
                  className={cn(
                    "cursor-pointer rounded-xl border p-3 text-center transition-colors has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50",
                    plan === p.id ? "border-primary bg-accent" : "hover:bg-accent/50"
                  )}
                >
                  <input
                    type="radio"
                    name="stepper-plan"
                    value={p.id}
                    checked={plan === p.id}
                    onChange={() => setPlan(p.id)}
                    className="sr-only"
                  />
                  <span className="block text-sm font-medium">{p.name}</span>
                  <span className="text-xs text-muted-foreground">{p.price}/mo</span>
                </label>
              ))}
            </div>
          </fieldset>
        </StepperPanel>
        <StepperCompleted className="flex flex-col items-center gap-2 py-4 text-center">
          <PartyPopper aria-hidden className="size-8 text-primary" />
          <p className="font-medium">You&apos;re all set</p>
          <p className="text-sm text-muted-foreground">
            {workspace || "Your workspace"} is ready on the {plans.find((p) => p.id === plan)?.name} plan.
          </p>
        </StepperCompleted>
      </StepperPanels>
      <StepperControls />
    </Stepper>
  );
}
