import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon, MinusIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";

export default function ButtonGroupOrientationDemo() {
  return (
    <div className="flex items-center gap-8">
      <ButtonGroup orientation="vertical" aria-label="Zoom">
        <Button variant="outline" size="icon" aria-label="Zoom in">
          <PlusIcon />
        </Button>
        <Button variant="outline" size="icon" aria-label="Zoom out">
          <MinusIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Text alignment">
        <Button variant="secondary" size="icon" aria-label="Align left">
          <AlignLeftIcon />
        </Button>
        <ButtonGroupSeparator />
        <Button variant="secondary" size="icon" aria-label="Align center">
          <AlignCenterIcon />
        </Button>
        <ButtonGroupSeparator />
        <Button variant="secondary" size="icon" aria-label="Align right">
          <AlignRightIcon />
        </Button>
      </ButtonGroup>
    </div>
  );
}
