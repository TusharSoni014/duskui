"use client";

import * as React from "react";
import { PricingTable, type BillingPeriod, type PricingPlan } from "@/components/dusk/pricing-table/pricing-table";

const plans: PricingPlan[] = [
  {
    id: "solo",
    name: "Solo",
    price: { monthly: 12, yearly: 9.5 },
    features: ["1 seat", "Unlimited exports", "Email support"],
    cta: { label: "Choose Solo" },
  },
  {
    id: "studio",
    name: "Studio",
    price: { monthly: 1290, yearly: 990 },
    features: ["25 seats", "Brand libraries", "Live collaboration"],
    cta: { label: "Choose Studio" },
    popular: true,
  },
];

export default function PricingTableControlledDemo() {
  const [billing, setBilling] = React.useState<BillingPeriod>("monthly");

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-4">
      <PricingTable
        plans={plans}
        billing={billing}
        onBillingChange={setBilling}
        currency="EUR"
        locale="de-DE"
        labels={{
          monthly: "Monatlich",
          yearly: "Jährlich",
          yearlyBadge: "",
          perMonth: "/Monat",
          perMonthLabel: "pro Monat",
          billedMonthly: "Monatliche Abrechnung",
          billedYearly: (total) => `${total} jährlich abgerechnet`,
        }}
      />
      <p className="font-mono text-xs text-muted-foreground">billing: {billing}</p>
    </div>
  );
}
