import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const channels = [
  { id: "notify-mentions", label: "Mentions", defaultChecked: true },
  { id: "notify-replies", label: "Replies to my threads", defaultChecked: true },
  { id: "notify-digest", label: "Weekly digest", defaultChecked: false },
];

export default function FieldFieldsetDemo() {
  return (
    <FieldGroup className="w-full max-w-md">
      <FieldSet>
        <FieldLegend>Notifications</FieldLegend>
        <FieldDescription>Choose what lands in your inbox.</FieldDescription>
        <FieldGroup data-slot="checkbox-group" className="gap-3">
          {channels.map((channel) => (
            <Field key={channel.id} orientation="horizontal">
              <Checkbox id={channel.id} defaultChecked={channel.defaultChecked} />
              <FieldLabel htmlFor={channel.id} className="font-normal">
                {channel.label}
              </FieldLabel>
            </Field>
          ))}
        </FieldGroup>
      </FieldSet>
      <FieldSeparator />
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="notify-quiet">Quiet hours</FieldLabel>
          <FieldDescription id="notify-quiet-hint">Pause notifications from 10pm to 8am.</FieldDescription>
        </FieldContent>
        <Switch id="notify-quiet" aria-describedby="notify-quiet-hint" />
      </Field>
      <Field orientation="responsive">
        <FieldContent>
          <FieldLabel htmlFor="notify-email">Forward to</FieldLabel>
          <FieldDescription id="notify-email-hint">Row on wide screens, stacked on narrow ones.</FieldDescription>
        </FieldContent>
        <Input id="notify-email" type="email" placeholder="you@example.com" aria-describedby="notify-email-hint" className="@md/field-group:max-w-52" />
      </Field>
    </FieldGroup>
  );
}
