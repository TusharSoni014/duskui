"use client";

import { SignupForm } from "@/components/dusk/field/signup-form";

export default function SignupFormDemo() {
  return (
    <div className="w-full max-w-sm">
      <SignupForm onSubmit={() => new Promise<void>((resolve) => setTimeout(resolve, 1200))} />
    </div>
  );
}
