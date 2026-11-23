import { Lock, Mail } from "lucide-react";

import { IceInput } from "@/components/dusk/glass/ice-input";
import { FrostButton } from "@/components/dusk/glass/frost-button";
import { GlassBackdrop } from "@/components/demos/glass-card/glass-backdrop";

export default function IceInputDemo() {
  return (
    <>
      <GlassBackdrop />
      <form className="relative grid w-full max-w-xs gap-3">
        <div className="grid gap-1.5">
          <label htmlFor="ice-email" className="text-sm font-medium text-white/85">
            Email
          </label>
          <IceInput id="ice-email" type="email" icon={<Mail />} placeholder="you@example.com" autoComplete="email" />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="ice-password" className="text-sm font-medium text-white/85">
            Password
          </label>
          <IceInput id="ice-password" type="password" icon={<Lock />} placeholder="••••••••" autoComplete="current-password" />
        </div>
        <FrostButton type="button" tone="primary" className="mt-2">
          Sign in
        </FrostButton>
      </form>
    </>
  );
}
