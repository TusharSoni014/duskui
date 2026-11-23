import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function RadioGroupStatesDemo() {
  return (
    <div className="flex flex-wrap gap-10">
      <RadioGroup defaultValue="card" orientation="horizontal" aria-label="Payment method" className="flex gap-5">
        {["card", "paypal", "invoice"].map((value) => (
          <div key={value} className="flex items-center gap-2">
            <RadioGroupItem value={value} id={`pay-${value}`} disabled={value === "invoice"} />
            <label htmlFor={`pay-${value}`} className="text-sm font-medium capitalize peer-disabled:opacity-50">
              {value}
            </label>
          </div>
        ))}
      </RadioGroup>
      <div className="grid gap-2">
        <RadioGroup aria-label="Agreement" aria-describedby="agree-error" className="flex gap-5">
          {["yes", "no"].map((value) => (
            <div key={value} className="flex items-center gap-2">
              <RadioGroupItem value={value} id={`agree-${value}`} aria-invalid />
              <label htmlFor={`agree-${value}`} className="text-sm font-medium capitalize">
                {value}
              </label>
            </div>
          ))}
        </RadioGroup>
        <p id="agree-error" className="text-xs text-destructive">
          Please choose an option.
        </p>
      </div>
    </div>
  );
}
