"use client";

import * as React from "react";
import { MailIcon } from "lucide-react";

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";

export default function InputGroupButtonDemo() {
  const [loading, setLoading] = React.useState(false);

  return (
    <form
      className="w-full max-w-sm"
      onSubmit={(event) => {
        event.preventDefault();
        setLoading(true);
        setTimeout(() => setLoading(false), 1200);
      }}
    >
      <InputGroup>
        <InputGroupAddon>
          <MailIcon />
        </InputGroupAddon>
        <InputGroupInput type="email" required placeholder="you@example.com" aria-label="Email" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton type="submit" variant="soft" size="xs" loading={loading}>
            Subscribe
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
