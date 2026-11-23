import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const fields = [
  { id: "width", label: "Width", value: "100%" },
  { id: "max-width", label: "Max width", value: "640px" },
  { id: "height", label: "Height", value: "auto" },
];

export default function PopoverBasicDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Settings2 />
          Dimensions
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-1">
            <h4 className="text-sm leading-none font-medium">Dimensions</h4>
            <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
          </div>
          <div className="grid gap-2">
            {fields.map((field) => (
              <div key={field.id} className="grid grid-cols-3 items-center gap-4">
                <label htmlFor={`popover-${field.id}`} className="text-sm">
                  {field.label}
                </label>
                <Input id={`popover-${field.id}`} defaultValue={field.value} className="col-span-2 h-8" />
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
