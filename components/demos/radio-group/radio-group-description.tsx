import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const options = [
  { value: "all", label: "All new messages", hint: "Every message in every channel." },
  { value: "mentions", label: "Direct messages and mentions", hint: "Only when someone needs you." },
  { value: "none", label: "Nothing", hint: "Mute notifications on this device." },
];

export default function RadioGroupDescriptionDemo() {
  return (
    <fieldset className="grid w-full max-w-sm gap-3">
      <legend className="mb-3 text-sm font-medium">Notify me about…</legend>
      <RadioGroup defaultValue="mentions" name="notify" className="gap-4">
        {options.map((option) => (
          <div key={option.value} className="flex items-start gap-3">
            <RadioGroupItem
              value={option.value}
              id={`notify-${option.value}`}
              aria-describedby={`notify-${option.value}-hint`}
              className="mt-0.5"
            />
            <div className="grid gap-1">
              <label htmlFor={`notify-${option.value}`} className="text-sm leading-none font-medium">
                {option.label}
              </label>
              <p id={`notify-${option.value}-hint`} className="text-xs text-muted-foreground">
                {option.hint}
              </p>
            </div>
          </div>
        ))}
      </RadioGroup>
    </fieldset>
  );
}
