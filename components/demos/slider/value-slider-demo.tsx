"use client";

import * as React from "react";
import { ValueSlider } from "@/components/dusk/slider/value-slider";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function ValueSliderDemo() {
  const [budget, setBudget] = React.useState([240, 720]);

  return (
    <div className="flex w-full max-w-sm flex-col gap-12 pt-8">
      <ValueSlider defaultValue={[42]} aria-label="Opacity" formatValue={(v) => `${v}%`} />
      <ValueSlider
        value={budget}
        onValueChange={setBudget}
        min={0}
        max={1000}
        step={10}
        minStepsBetweenThumbs={5}
        aria-label="Budget"
        formatValue={(v) => currency.format(v)}
      />
    </div>
  );
}
