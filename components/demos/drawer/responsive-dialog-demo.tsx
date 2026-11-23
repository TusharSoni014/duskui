"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/dusk/drawer/responsive-dialog";

export default function ResponsiveDialogDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <ResponsiveDialog>
        <ResponsiveDialogTrigger asChild>
          <Button>Invite teammate</Button>
        </ResponsiveDialogTrigger>
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Invite a teammate</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>They&apos;ll get an email with a link to join the workspace.</ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <ResponsiveDialogBody className="grid gap-2">
            <label htmlFor="invite-email" className="text-sm font-medium">
              Email
            </label>
            <Input id="invite-email" type="email" placeholder="ada@example.com" autoComplete="off" />
          </ResponsiveDialogBody>
          <ResponsiveDialogFooter>
            <ResponsiveDialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </ResponsiveDialogClose>
            <ResponsiveDialogClose asChild>
              <Button>Send invite</Button>
            </ResponsiveDialogClose>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
      <p className="text-xs text-muted-foreground">Resize below 768px to get the drawer.</p>
    </div>
  );
}
