import { Input } from "@/components/ui/input";

export default function InputStatesDemo() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      <Input placeholder="Disabled" disabled />
      <Input defaultValue="Read only" readOnly />
      <Input type="file" />
    </div>
  );
}
