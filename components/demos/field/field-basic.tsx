import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function FieldBasicDemo() {
  return (
    <FieldGroup className="w-full max-w-sm gap-6">
      <Field>
        <FieldLabel htmlFor="field-username">Username</FieldLabel>
        <Input id="field-username" placeholder="dusk.dev" aria-describedby="field-username-hint" />
        <FieldDescription id="field-username-hint">Your public handle. You can change it later.</FieldDescription>
      </Field>
      <Field data-invalid>
        <FieldLabel htmlFor="field-site">Website</FieldLabel>
        <Input id="field-site" defaultValue="not a url" aria-invalid aria-describedby="field-site-error" />
        <FieldError id="field-site-error">Enter a full URL, like https://example.com.</FieldError>
      </Field>
      <Field data-disabled>
        <FieldLabel htmlFor="field-team">Team</FieldLabel>
        <Input id="field-team" defaultValue="Acme Inc." disabled aria-describedby="field-team-hint" />
        <FieldDescription id="field-team-hint">Managed by your organization.</FieldDescription>
      </Field>
    </FieldGroup>
  );
}
