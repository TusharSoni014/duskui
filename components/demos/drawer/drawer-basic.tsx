"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";

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

export default function DrawerBasicDemo() {
  const [goal, setGoal] = React.useState(350);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Set daily goal</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Move goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal. Drag down to dismiss.</DrawerDescription>
          </DrawerHeader>
          <div className="flex items-center justify-center gap-6 p-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              aria-label="Decrease goal"
              aria-disabled={goal <= 200 || undefined}
              onClick={() => setGoal((g) => Math.max(200, g - 10))}
            >
              <Minus />
            </Button>
            <div className="w-28 text-center">
              <div className="text-6xl font-bold tracking-tighter tabular-nums" aria-live="polite">
                {goal}
              </div>
              <div className="text-xs tracking-wide text-muted-foreground uppercase">kcal / day</div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              aria-label="Increase goal"
              aria-disabled={goal >= 600 || undefined}
              onClick={() => setGoal((g) => Math.min(600, g + 10))}
            >
              <Plus />
            </Button>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button>Save goal</Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
