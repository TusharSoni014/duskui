import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const sides = ["top", "right", "bottom", "left"] as const;

export default function PopoverSidesDemo() {
  return (
    <>
      {sides.map((side) => (
        <Popover key={side}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="capitalize">
              {side}
            </Button>
          </PopoverTrigger>
          <PopoverContent side={side} className="w-48 text-sm">
            Grows out of the trigger from the <span className="font-medium text-foreground">{side}</span>.
          </PopoverContent>
        </Popover>
      ))}
    </>
  );
}
