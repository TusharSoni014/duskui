import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ButtonSizesDemo() {
  return (
    <>
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon-sm" variant="outline" aria-label="Settings">
        <Settings />
      </Button>
      <Button size="icon" variant="outline" aria-label="Settings">
        <Settings />
      </Button>
      <Button size="icon-lg" variant="outline" aria-label="Settings">
        <Settings />
      </Button>
    </>
  );
}
