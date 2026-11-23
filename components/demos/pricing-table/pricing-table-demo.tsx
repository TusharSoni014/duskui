import { PricingTable, type PricingPlan } from "@/components/dusk/pricing-table/pricing-table";

const plans: PricingPlan[] = [
  {
    id: "hobby",
    name: "Hobby",
    description: "For side projects and experiments.",
    price: { monthly: 0, yearly: 0 },
    features: ["3 projects", "Community components", "Basic analytics"],
    cta: { label: "Start free" },
  },
  {
    id: "pro",
    name: "Pro",
    description: "For freelancers shipping client work.",
    price: { monthly: 19, yearly: 15 },
    features: ["Unlimited projects", "All 60+ components", "Figma kit", "Priority support"],
    cta: { label: "Get Pro" },
    popular: true,
  },
  {
    id: "team",
    name: "Team",
    description: "For product teams with a design system.",
    price: { monthly: 49, yearly: 39 },
    features: ["Everything in Pro", "Up to 10 seats", "Private registry", "SSO & audit log"],
    cta: { label: "Start a trial" },
  },
];

export default function PricingTableDemo() {
  return <PricingTable plans={plans} defaultBilling="yearly" className="max-w-3xl" />;
}
