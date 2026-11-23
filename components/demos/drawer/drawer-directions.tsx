import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const directions = ["top", "right", "bottom", "left"] as const;

export default function DrawerDirectionsDemo() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {directions.map((direction) => (
        <Drawer key={direction} direction={direction}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="capitalize">
              {direction}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="capitalize">{direction} drawer</DrawerTitle>
              <DrawerDescription>Swipe toward the {direction} edge to dismiss it.</DrawerDescription>
            </DrawerHeader>
            <div className="px-4 text-sm text-muted-foreground">
              Side drawers make good filter panels; top drawers suit announcements.
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  );
}
