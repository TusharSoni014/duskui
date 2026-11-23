"use client";

import * as React from "react";
import { Rocket, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function useFakeRequest(ms = 1800) {
  const [loading, setLoading] = React.useState(false);
  const run = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), ms);
  };
  return [loading, run] as const;
}

export default function ButtonLoadingDemo() {
  const [deploying, deploy] = useFakeRequest();
  const [sending, send] = useFakeRequest();
  const [deleting, remove] = useFakeRequest();

  return (
    <>
      <Button loading={deploying} onClick={deploy}>
        <Rocket />
        Deploy
      </Button>
      <Button variant="secondary" loading={sending} loadingText="Sending…" onClick={send}>
        <Send />
        Send invite
      </Button>
      <Button variant="destructive" size="icon" aria-label="Delete" loading={deleting} onClick={remove}>
        <Trash2 />
      </Button>
    </>
  );
}
