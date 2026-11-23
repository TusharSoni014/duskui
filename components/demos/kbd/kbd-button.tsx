import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

export default function KbdButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button variant="outline" className="w-60 justify-start px-3 font-normal text-muted-foreground">
        <SearchIcon />
        Search docs…
        <KbdGroup className="ml-auto">
          <Kbd size="sm">Ctrl</Kbd>
          <Kbd size="sm">K</Kbd>
        </KbdGroup>
      </Button>
      <Button size="sm">
        Save changes
        <Kbd size="sm" className="border-black/15 bg-black/10 text-primary-foreground/80 shadow-none">
          ↵<span className="sr-only">Enter</span>
        </Kbd>
      </Button>
    </div>
  );
}
