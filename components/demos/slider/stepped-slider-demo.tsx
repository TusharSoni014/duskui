"use client";

import * as React from "react";
import { SteppedSlider } from "@/components/dusk/slider/stepped-slider";

const plans = [
  { value: "1k", label: "1K", valueText: "1,000 requests" },
  { value: "10k", label: "10K", valueText: "10,000 requests" },
  { value: "50k", label: "50K", valueText: "50,000 requests" },
  { value: "100k", label: "100K", valueText: "100,000 requests" },
  { value: "500k", label: "500K", valueText: "500,000 requests" },
  { value: "1m", label: "1M", valueText: "1 million requests" },
];

const prices: Record<string, number> = { "1k": 0, "10k": 19, "50k": 49, "100k": 89, "500k": 249, "1m": 399 };

export default function SteppedSliderDemo() {
  const [plan, setPlan] = React.useState("50k");

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="flex items-end justify-between">
        <div>
          <p id="requests-label" className="text-sm font-medium">Monthly requests</p>
          <p className="text-xs text-muted-foreground">Billed monthly, cancel any time.</p>
        </div>
        <p className="text-2xl font-semibold tracking-tight tabular-nums">
          ${prices[plan]}
          <span className="text-sm font-normal text-muted-foreground">/mo</span>
        </p>
      </div>
      <SteppedSlider steps={plans} value={plan} onValueChange={setPlan} aria-label="Monthly requests" />
      <SteppedSlider steps={["XS", "S", "M", "L", "XL"]} defaultValue="M" aria-label="T-shirt size" />
    </div>
  );
}
