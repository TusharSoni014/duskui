import { FloatingLabelInput } from "@/components/dusk/input/floating-label-input";

export default function FloatingLabelDemo() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      <FloatingLabelInput label="Full name" autoComplete="name" />
      <FloatingLabelInput label="Company" defaultValue="DuskUI" />
    </div>
  );
}
