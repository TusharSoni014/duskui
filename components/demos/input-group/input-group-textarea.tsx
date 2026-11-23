"use client";

import * as React from "react";
import { ArrowUpIcon, PaperclipIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

const limit = 280;

export default function InputGroupTextareaDemo() {
  const [text, setText] = React.useState("");
  const left = limit - text.length;

  return (
    <InputGroup className="max-w-md">
      <InputGroupTextarea
        value={text}
        onChange={(event) => setText(event.target.value.slice(0, limit))}
        placeholder="Write a reply…"
        aria-label="Reply"
        aria-describedby="reply-count"
        className="max-h-40"
      />
      <InputGroupAddon align="block-end" className="border-t">
        <InputGroupButton size="icon-xs" aria-label="Attach a file">
          <PaperclipIcon />
        </InputGroupButton>
        <InputGroupText id="reply-count" className="ml-auto text-xs tabular-nums">
          <span className={left < 20 ? "text-destructive" : undefined}>{left}</span>
          <span className="sr-only"> characters left</span>
        </InputGroupText>
        <InputGroupButton variant="default" size="icon-xs" className="rounded-full" aria-label="Send" disabled={!text.trim()}>
          <ArrowUpIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
