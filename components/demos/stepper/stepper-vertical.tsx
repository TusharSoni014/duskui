"use client";

import { GitBranch, Globe, KeyRound, Rocket } from "lucide-react";

import {
  Stepper,
  StepperCompleted,
  StepperControls,
  StepperNav,
  StepperPanel,
  StepperPanels,
} from "@/components/dusk/stepper/stepper";

const steps = [
  { title: "Repository", description: "Connect GitHub", icon: GitBranch, body: "Pick a repository and the branch to deploy from. Pushes to it redeploy automatically." },
  { title: "Environment", description: "Secrets & variables", icon: KeyRound, body: "Add DATABASE_URL and any API keys. Values are encrypted and only exposed at build time." },
  { title: "Domain", description: "Custom hostname", icon: Globe, body: "Point a CNAME at edge.dusk.app. Certificates are issued and renewed for you." },
];

export default function StepperVerticalDemo() {
  return (
    <Stepper steps={steps} orientation="vertical" className="max-w-2xl">
      <StepperNav label="Deploy steps" />
      {/* In vertical mode the panels and controls share the second column. */}
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <StepperPanels>
          {steps.map((step, i) => (
            <StepperPanel key={step.title} index={i} className="rounded-xl border bg-card p-5">
              <step.icon aria-hidden className="mb-3 size-5 text-muted-foreground" />
              <h3 className="font-medium">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </StepperPanel>
          ))}
          <StepperCompleted className="rounded-xl border bg-card p-5">
            <Rocket aria-hidden className="mb-3 size-5 text-primary" />
            <h3 className="font-medium">Deploying…</h3>
            <p className="mt-1 text-sm text-muted-foreground">Your first build is on its way. We&apos;ll email you when it&apos;s live.</p>
          </StepperCompleted>
        </StepperPanels>
        <StepperControls completeLabel="Deploy" />
      </div>
    </Stepper>
  );
}
