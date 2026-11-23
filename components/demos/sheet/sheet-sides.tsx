import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const sides = ["top", "right", "bottom", "left"] as const;

export default function SheetSidesDemo() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {sides.map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline" className="capitalize">
              {side}
            </Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle className="capitalize">{side} sheet</SheetTitle>
              <SheetDescription>
                Slides in from the {side} on an expo-out curve and closes faster than it opened.
              </SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-6 text-sm text-muted-foreground">
              Press Escape, click the backdrop or use the close button. Focus returns to the button
              that opened it.
            </div>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}
