import { Bold, Italic, Strikethrough, Underline } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function ToggleGroupBasicDemo() {
  return (
    <ToggleGroup type="multiple" defaultValue={["bold"]} aria-label="Text formatting">
      <ToggleGroupItem value="bold" aria-label="Bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <Underline />
      </ToggleGroupItem>
      <ToggleGroupItem value="strikethrough" aria-label="Strikethrough">
        <Strikethrough />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
