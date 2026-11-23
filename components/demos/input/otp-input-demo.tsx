"use client";

import * as React from "react";
import { OTPInput } from "@/components/dusk/input/otp-input";

export default function OTPInputDemo() {
  const [code, setCode] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "invalid" | "valid">("idle");

  return (
    <div className="flex flex-col items-center gap-3">
      <OTPInput
        value={code}
        onValueChange={(v) => {
          setCode(v);
          setStatus("idle");
        }}
        onComplete={(v) => setStatus(v === "123456" ? "valid" : "invalid")}
        invalid={status === "invalid"}
        aria-label="Verification code"
      />
      <p className="h-4 text-xs text-muted-foreground" aria-live="polite">
        {status === "valid" ? "Verified ✓" : status === "invalid" ? "Wrong code — try 123456" : "Type or paste 123456"}
      </p>
    </div>
  );
}
