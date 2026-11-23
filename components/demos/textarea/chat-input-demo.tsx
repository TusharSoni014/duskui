"use client";

import * as React from "react";
import { AtSign, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/dusk/textarea/chat-input";

export default function ChatInputDemo() {
  const [messages, setMessages] = React.useState<string[]>(["Ship the animated form components today?"]);

  return (
    <div className="grid w-full max-w-md gap-3">
      <ul className="grid gap-2" aria-label="Messages" aria-live="polite">
        {messages.map((message, i) => (
          <li
            key={i}
            className="max-w-[85%] justify-self-end rounded-2xl rounded-br-md bg-primary/10 px-3 py-2 text-sm whitespace-pre-wrap text-foreground"
          >
            {message}
          </li>
        ))}
      </ul>
      <ChatInput
        aria-label="Message"
        placeholder="Ask anything…"
        onSubmit={(message) =>
          // Pretend to send it: the button shows a spinner until this resolves.
          new Promise<void>((resolve) =>
            setTimeout(() => {
              setMessages((list) => [...list.slice(-2), message]);
              resolve();
            }, 900)
          )
        }
        actions={
          <>
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Attach a file" className="rounded-full">
              <Paperclip />
            </Button>
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Mention someone" className="rounded-full">
              <AtSign />
            </Button>
          </>
        }
      />
    </div>
  );
}
