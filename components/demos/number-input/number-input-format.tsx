import { NumberInput } from "@/components/dusk/number-input/number-input";

export default function NumberInputFormatDemo() {
  return (
    <div className="grid w-full max-w-xs gap-4">
      <div className="grid gap-2">
        <label htmlFor="budget" className="text-sm font-medium">
          Monthly budget
        </label>
        <NumberInput
          id="budget"
          defaultValue={1250}
          min={0}
          step={50}
          largeStep={1000}
          formatOptions={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
          className="w-full"
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="discount" className="text-sm font-medium">
          Discount
        </label>
        <NumberInput
          id="discount"
          defaultValue={0.15}
          min={0}
          max={1}
          step={0.05}
          formatOptions={{ style: "percent" }}
          className="w-full"
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="weight" className="text-sm font-medium">
          Weight (de-DE)
        </label>
        <NumberInput
          id="weight"
          defaultValue={2.5}
          min={0}
          step={0.1}
          locale="de-DE"
          formatOptions={{ style: "unit", unit: "kilogram", minimumFractionDigits: 1, maximumFractionDigits: 1 }}
          className="w-full"
        />
      </div>
    </div>
  );
}
