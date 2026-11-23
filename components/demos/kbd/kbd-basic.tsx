import { ArrowBigUp, Command, CornerDownLeft } from "lucide-react";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

export default function KbdBasicDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Kbd size="sm">Esc</Kbd>
        <Kbd>Tab</Kbd>
        <Kbd size="lg">Space</Kbd>
        <KbdGroup>
          <Kbd>
            <Command aria-hidden />
            <span className="sr-only">Command</span>
          </Kbd>
          <Kbd>
            <ArrowBigUp aria-hidden />
            <span className="sr-only">Shift</span>
          </Kbd>
          <Kbd>P</Kbd>
        </KbdGroup>
        <Kbd pressed>
          <CornerDownLeft aria-hidden />
          <span className="sr-only">Enter</span>
        </Kbd>
      </div>
      <p className="max-w-sm text-center text-sm text-muted-foreground">
        Press{" "}
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <span aria-hidden>+</span>
          <Kbd>B</Kbd>
        </KbdGroup>{" "}
        to toggle the sidebar, or <Kbd>/</Kbd> to jump to search.
      </p>
    </div>
  );
}
