"use client";

import * as React from "react";
import { Save } from "lucide-react";
import { StatusButton, useStatusAction } from "@/components/dusk/button/status-button";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function StatusButtonDemo() {
  const save = useStatusAction(() => wait(1400));
  const flaky = useStatusAction(async () => {
    await wait(1200);
    throw new Error("Network error");
  });

  return (
    <>
      <StatusButton status={save.status} onClick={save.run}>
        <Save />
        Save changes
      </StatusButton>
      <StatusButton
        variant="outline"
        status={flaky.status}
        onClick={flaky.run}
        labels={{ loading: "Publishing", error: "Failed — retry" }}
      >
        Publish (fails)
      </StatusButton>
    </>
  );
}
