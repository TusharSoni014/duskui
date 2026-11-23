import { KeyRoundIcon } from "lucide-react";

import { CopyInput } from "@/components/dusk/input-group/copy-input";

export default function CopyInputDemo() {
  return (
    <div className="grid w-full max-w-md gap-4">
      <CopyInput value="npx shadcn@latest add https://duskui.com/r/copy-input.json" aria-label="Install command" />
      <CopyInput
        value="dusk_test_4f9c2a7e1b3d"
        addon={<KeyRoundIcon />}
        copyLabel=""
        aria-label="API key"
      />
    </div>
  );
}
