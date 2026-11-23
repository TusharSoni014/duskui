"use client";

import * as React from "react";
import { Building2, Rocket, Sparkles } from "lucide-react";
import { RadioCard, RadioCards } from "@/components/dusk/radio-group/radio-cards";

export default function RadioCardsDemo() {
  const [plan, setPlan] = React.useState("pro");

  return (
    <RadioCards
      value={plan}
      onValueChange={setPlan}
      name="plan"
      aria-label="Plan"
      className="w-full max-w-md"
    >
      <RadioCard
        value="hobby"
        icon={<Sparkles />}
        title="Hobby"
        aside="$0"
        description="Personal projects and experiments."
      />
      <RadioCard
        value="pro"
        icon={<Rocket />}
        title="Pro"
        aside="$24/mo"
        description="Unlimited projects, preview deployments and analytics."
      />
      <RadioCard
        value="enterprise"
        icon={<Building2 />}
        title="Enterprise"
        aside="Custom"
        description="SSO, audit logs and a dedicated support engineer."
      />
    </RadioCards>
  );
}
