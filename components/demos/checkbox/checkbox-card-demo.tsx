import { BarChart3, Globe, ShieldCheck } from "lucide-react";
import { CheckboxCard } from "@/components/dusk/checkbox/checkbox-card";

export default function CheckboxCardDemo() {
  return (
    <fieldset className="grid w-full max-w-md gap-3">
      <legend className="mb-3 text-sm font-medium">Add-ons</legend>
      <CheckboxCard
        name="addons"
        value="analytics"
        defaultChecked
        icon={<BarChart3 />}
        title="Analytics"
        description="Privacy-friendly page views and funnels."
      >
        <span className="text-xs text-muted-foreground">+$9 / month</span>
      </CheckboxCard>
      <CheckboxCard
        name="addons"
        value="domains"
        icon={<Globe />}
        title="Custom domains"
        description="Bring your own domain with automatic TLS."
      >
        <span className="text-xs text-muted-foreground">+$5 / month</span>
      </CheckboxCard>
      <CheckboxCard
        name="addons"
        value="sso"
        icon={<ShieldCheck />}
        title="Single sign-on"
        description="SAML and OIDC for your whole team."
        disabled
      >
        <span className="text-xs text-muted-foreground">Enterprise only</span>
      </CheckboxCard>
    </fieldset>
  );
}
