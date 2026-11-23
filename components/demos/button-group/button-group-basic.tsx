import { ArchiveIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";

export default function ButtonGroupBasicDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <ButtonGroup aria-label="Message actions">
        <ButtonGroup>
          <Button variant="outline" size="icon" aria-label="Previous message">
            <ChevronLeftIcon />
          </Button>
          <ButtonGroupText className="px-3 tabular-nums">3 / 12</ButtonGroupText>
          <Button variant="outline" size="icon" aria-label="Next message">
            <ChevronRightIcon />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline">
            <ArchiveIcon />
            Archive
          </Button>
          <Button variant="outline">
            <ClockIcon />
            Snooze
          </Button>
          <Button variant="outline" size="icon" aria-label="Delete" className="hover:text-destructive">
            <Trash2Icon />
          </Button>
        </ButtonGroup>
      </ButtonGroup>
    </div>
  );
}
