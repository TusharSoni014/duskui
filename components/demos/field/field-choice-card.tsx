import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldSet, FieldLegend, FieldTitle } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";

export default function FieldChoiceCardDemo() {
  return (
    <FieldSet className="w-full max-w-sm gap-3">
      <FieldLegend variant="label">Workspace features</FieldLegend>
      <FieldLabel htmlFor="feature-ai">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>AI summaries</FieldTitle>
            <FieldDescription>Summarize long threads in one click.</FieldDescription>
          </FieldContent>
          <Switch id="feature-ai" defaultChecked />
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="feature-analytics">
        <Field orientation="horizontal">
          <Checkbox id="feature-analytics" />
          <FieldContent>
            <FieldTitle>Usage analytics</FieldTitle>
            <FieldDescription>Weekly charts of who uses what.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
    </FieldSet>
  );
}
