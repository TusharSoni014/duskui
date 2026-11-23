import { AtSignIcon, SearchIcon } from "lucide-react";

import { Kbd } from "@/components/ui/kbd";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";

export default function InputGroupBasicDemo() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <InputGroup>
        <InputGroupInput placeholder="Search docs…" aria-label="Search docs" />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Kbd>⌘K</Kbd>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="handle" aria-label="Handle" />
        <InputGroupAddon>
          <AtSignIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupText>.dusk.dev</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput inputMode="decimal" placeholder="0.00" aria-label="Amount" aria-invalid />
        <InputGroupAddon align="inline-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
