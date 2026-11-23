import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import PricingTableDemo from "@/components/demos/pricing-table/pricing-table-demo";
import PricingTableFeaturesDemo from "@/components/demos/pricing-table/pricing-table-features";
import PricingTableControlledDemo from "@/components/demos/pricing-table/pricing-table-controlled";

const demo = (file: string) => `components/demos/pricing-table/${file}`;

const config: DocConfig = {
  title: "Pricing Table",
  intro:
    "An animated pricing table for React and Tailwind CSS: a monthly/yearly toggle with a gliding pill, prices that roll digit by digit without layout shift, a popular plan marked with a primary border and label, and feature lists with check icons. Fully data-driven and localized with Intl.NumberFormat.",
  tags: ["Monthly / yearly toggle", "Rolling digits", "No width jitter", "Data-driven", "Intl currency", "prefers-reduced-motion"],
  hero: { Demo: PricingTableDemo, file: demo("pricing-table-demo.tsx"), minHeight: 640 },
  install: {
    registry: "pricing-table",
    source: "components/dusk/pricing-table/pricing-table.tsx",
    deps: "motion lucide-react",
    note: <>Uses the DuskUI Button for the call to action; the CLI installs it for you.</>,
  },
  usage: {
    filename: "pricing.tsx",
    code: `import { PricingTable, type PricingPlan } from "@/components/dusk/pricing-table/pricing-table"

const plans: PricingPlan[] = [
  {
    id: "pro",
    name: "Pro",
    price: { monthly: 19, yearly: 15 },
    features: ["Unlimited projects", "Priority support"],
    cta: { label: "Get Pro", href: "/signup?plan=pro" },
    popular: true,
  },
]

export function Pricing() {
  return <PricingTable plans={plans} />
}`,
  },
  examples: [
    {
      id: "features",
      title: "Excluded features & custom price",
      description: (
        <>
          Mark a feature <Code>included: false</Code> to show it muted with a dash (and a hidden “Not
          included” for screen readers). A text <Code>price</Code> such as <Code>&quot;Custom&quot;</Code>{" "}
          skips the roll, and a <Code>cta.href</Code> renders a link.
        </>
      ),
      Demo: PricingTableFeaturesDemo,
      file: demo("pricing-table-features.tsx"),
      minHeight: 560,
    },
    {
      id: "controlled",
      title: "Controlled & localized",
      description: (
        <>
          Control the period with <Code>billing</Code> / <Code>onBillingChange</Code>, and pass{" "}
          <Code>currency</Code>, <Code>locale</Code> and <Code>labels</Code> to localize every string.
          Prices with different digit counts still never push the layout around.
        </>
      ),
      Demo: PricingTableControlledDemo,
      file: demo("pricing-table-controlled.tsx"),
      minHeight: 520,
    },
  ],
  api: {
    intro: (
      <>
        A plan is <Code>{"{ id, name, description?, price, features, cta, popular?, badge? }"}</Code>. The root
        also accepts any <Code>&lt;div&gt;</Code> attribute.
      </>
    ),
    props: [
      { name: "plans", type: "PricingPlan[]", description: "Plans to render, in order." },
      { name: "plan.price", type: "{ monthly: number; yearly: number } | number | string", description: "Per-month price for each period (yearly = monthly price when billed yearly), one number, or text like \"Custom\"." },
      { name: "plan.features", type: "(string | { label; included? })[]", description: "Feature list. included: false shows a muted dash." },
      { name: "plan.cta", type: "{ label; href?; onClick? }", description: "Call to action. href renders the DuskUI Button as a link." },
      { name: "plan.popular", type: "boolean", description: "Highlight with a 1px primary border and a label (plan.badge, default \"Most popular\")." },
      { name: "billing", type: '"monthly" | "yearly"', description: "Billing period (controlled)." },
      { name: "defaultBilling", type: '"monthly" | "yearly"', default: '"monthly"', description: "Initial period when uncontrolled." },
      { name: "onBillingChange", type: "(billing) => void", description: "Called when the period changes." },
      { name: "showToggle", type: "boolean", default: "true", description: "Show the monthly / yearly switch." },
      { name: "currency", type: "string", default: '"USD"', description: "ISO 4217 currency code." },
      { name: "locale", type: "string", default: '"en-US"', description: "BCP 47 locale for number formatting. Fixed by default to avoid hydration mismatches." },
      { name: "labels", type: "Partial<PricingLabels>", description: "Toggle, period, billing note and screen-reader strings." },
    ],
  },
  accessibility: [
    <>The billing switch is a native radio group (<Code>role=&quot;radiogroup&quot;</Code>), so arrow keys move between periods and screen readers announce the selection.</>,
    "Each price has a plain-text copy, e.g. “$15 per month”, while the rolling digits are aria-hidden.",
    "Each plan is an article labelled by its name; features are a list, and excluded features are prefixed with a hidden “Not included:”.",
    "Digits use tabular-nums and the widest possible price is reserved, so toggling never shifts the layout.",
    "With prefers-reduced-motion prices and the pill switch instantly.",
  ],
};

export function PricingTableDocs() {
  return <ComponentDocs config={config} />;
}
