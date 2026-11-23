import { PricingTable, type PricingPlan } from "@/components/dusk/pricing-table/pricing-table";

const plans: PricingPlan[] = [
  {
    id: "startup",
    name: "Startup",
    description: "Everything to launch.",
    price: { monthly: 99, yearly: 79 },
    features: [
      "5 team members",
      "10k monthly events",
      { label: "Custom domains", included: true },
      { label: "Dedicated support", included: false },
      { label: "99.99% uptime SLA", included: false },
    ],
    cta: { label: "Choose Startup" },
    popular: true,
    badge: "Best value",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Scale, security and a human to call.",
    price: "Custom",
    features: [
      "Unlimited members",
      "Unlimited events",
      "Custom domains",
      "Dedicated support",
      "99.99% uptime SLA",
    ],
    cta: { label: "Contact sales", href: "#contact" },
  },
];

export default function PricingTableFeaturesDemo() {
  return <PricingTable plans={plans} className="max-w-xl" labels={{ yearlyBadge: "−20%" }} />;
}
