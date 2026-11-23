import {
  AnimatedTabs,
  AnimatedTabsContent,
  AnimatedTabsList,
  AnimatedTabsPanels,
  AnimatedTabsTrigger,
} from "@/components/dusk/tabs/animated-tabs";

const plans = [
  { value: "starter", label: "Starter", price: "$0", body: "For side projects and prototypes." },
  { value: "pro", label: "Pro", price: "$24", body: "For teams shipping every day. Unlimited projects and preview deployments." },
  { value: "enterprise", label: "Enterprise", price: "Custom", body: "SSO, audit logs and a dedicated support engineer." },
];

export default function AnimatedTabsUnderlineDemo() {
  return (
    <AnimatedTabs defaultValue="pro" indicator="underline" className="w-full max-w-md">
      <AnimatedTabsList>
        {plans.map((p) => (
          <AnimatedTabsTrigger key={p.value} value={p.value}>
            {p.label}
          </AnimatedTabsTrigger>
        ))}
      </AnimatedTabsList>
      <AnimatedTabsPanels>
        {plans.map((p) => (
          <AnimatedTabsContent key={p.value} value={p.value} className="py-3">
            <p className="text-3xl font-semibold tracking-tight">{p.price}</p>
            <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
          </AnimatedTabsContent>
        ))}
      </AnimatedTabsPanels>
    </AnimatedTabs>
  );
}
