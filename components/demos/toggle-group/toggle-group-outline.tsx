import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function ToggleGroupOutlineDemo() {
  return (
    <div className="grid justify-items-center gap-6">
      <ToggleGroup type="single" variant="outline" defaultValue="left" aria-label="Text alignment">
        <ToggleGroupItem value="left" aria-label="Align left">
          <AlignLeft />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <AlignCenter />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <AlignRight />
        </ToggleGroupItem>
        <ToggleGroupItem value="justify" aria-label="Justify">
          <AlignJustify />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" variant="outline" size="sm" spacing={2} defaultValue="week" aria-label="Range">
        <ToggleGroupItem value="day">Day</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
        <ToggleGroupItem value="year" disabled>
          Year
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
