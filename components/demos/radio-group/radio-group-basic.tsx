import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const options = [
  { value: "default", label: "Default" },
  { value: "comfortable", label: "Comfortable" },
  { value: "compact", label: "Compact" },
];

export default function RadioGroupBasicDemo() {
  return (
    <RadioGroup defaultValue="comfortable" aria-label="Density">
      {options.map((option) => (
        <div key={option.value} className="flex items-center gap-3">
          <RadioGroupItem value={option.value} id={`density-${option.value}`} />
          <label htmlFor={`density-${option.value}`} className="text-sm font-medium">
            {option.label}
          </label>
        </div>
      ))}
    </RadioGroup>
  );
}
