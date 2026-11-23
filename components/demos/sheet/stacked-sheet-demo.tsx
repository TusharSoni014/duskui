"use client";

import type * as React from "react";
import { ChevronRight, CreditCard, KeyRound, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  StackedSheet,
  StackedSheetClose,
  StackedSheetContent,
  StackedSheetTrigger,
} from "@/components/dusk/sheet/stacked-sheet";

function Row({ icon, title, hint }: { icon: React.ReactNode; title: string; hint: string }) {
  return (
    <span className="flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition-colors hover:bg-accent/60">
      <span className="flex size-8 items-center justify-center rounded-md border bg-white/[0.03] text-primary [&_svg]:size-4">
        {icon}
      </span>
      <span className="flex-1">
        <span className="block text-sm font-medium">{title}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
      <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
    </span>
  );
}

export default function StackedSheetDemo() {
  return (
    <StackedSheet>
      <StackedSheetTrigger asChild>
        <Button variant="outline">Account settings</Button>
      </StackedSheetTrigger>
      <StackedSheetContent title="Account" description="Open a section — this sheet steps back underneath.">
        <div className="grid gap-2">
          <StackedSheet>
            <StackedSheetTrigger className="rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
              <Row icon={<KeyRound />} title="Security" hint="Password and two-factor" />
            </StackedSheetTrigger>
            <StackedSheetContent title="Security" description="Keep your account safe.">
              <div className="grid gap-2">
                <StackedSheet>
                  <StackedSheetTrigger className="rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
                    <Row icon={<Smartphone />} title="Two-factor auth" hint="Add an authenticator app" />
                  </StackedSheetTrigger>
                  <StackedSheetContent
                    title="Two-factor auth"
                    description="Enter the 6-digit code from your app."
                    footer={
                      <StackedSheetClose asChild>
                        <Button onClick={() => toast.success("Two-factor enabled")}>Verify</Button>
                      </StackedSheetClose>
                    }
                  >
                    <label htmlFor="otp" className="mb-2 block text-sm font-medium">Code</label>
                    <Input id="otp" inputMode="numeric" autoComplete="one-time-code" placeholder="123 456" />
                  </StackedSheetContent>
                </StackedSheet>
                <p className="px-1 pt-2 text-xs text-muted-foreground">Last password change: 3 months ago.</p>
              </div>
            </StackedSheetContent>
          </StackedSheet>
          <StackedSheet>
            <StackedSheetTrigger className="rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
              <Row icon={<CreditCard />} title="Billing" hint="Pro plan · renews Dec 1" />
            </StackedSheetTrigger>
            <StackedSheetContent title="Billing" description="Manage your plan and invoices.">
              <ul className="grid gap-2 text-sm">
                {["Nov 2026", "Oct 2026", "Sep 2026"].map((month) => (
                  <li key={month} className="flex justify-between rounded-lg border px-3 py-2.5">
                    <span>{month}</span>
                    <span className="text-muted-foreground">$24.00</span>
                  </li>
                ))}
              </ul>
            </StackedSheetContent>
          </StackedSheet>
        </div>
      </StackedSheetContent>
    </StackedSheet>
  );
}
