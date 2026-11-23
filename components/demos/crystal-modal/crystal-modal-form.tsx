"use client";

import * as React from "react";
import { AtSign, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FrostButton } from "@/components/dusk/glass/frost-button";
import { IceInput } from "@/components/dusk/glass/ice-input";
import {
  CrystalModal,
  CrystalModalClose,
  CrystalModalContent,
  CrystalModalDescription,
  CrystalModalFooter,
  CrystalModalHeader,
  CrystalModalTitle,
  CrystalModalTrigger,
} from "@/components/dusk/glass/crystal-modal";
import { GlassBackdrop } from "@/components/demos/glass-card/glass-backdrop";

export default function CrystalModalForm() {
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setOpen(false);
    }, 1200);
  };

  return (
    <>
      <GlassBackdrop />
      <CrystalModal open={open} onOpenChange={setOpen}>
        <CrystalModalTrigger asChild>
          <FrostButton size="lg" className="rounded-full">
            Edit profile
          </FrostButton>
        </CrystalModalTrigger>
        <CrystalModalContent size="sm">
          <form onSubmit={onSubmit} className="grid gap-4">
            <CrystalModalHeader>
              <CrystalModalTitle>Edit profile</CrystalModalTitle>
              <CrystalModalDescription>Changes are visible to your team.</CrystalModalDescription>
            </CrystalModalHeader>
            <div className="grid gap-1.5">
              <label htmlFor="crystal-name" className="text-sm font-medium text-white/80">
                Name
              </label>
              <IceInput id="crystal-name" icon={<User />} defaultValue="Ava Lindqvist" autoComplete="name" />
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="crystal-handle" className="text-sm font-medium text-white/80">
                Username
              </label>
              <IceInput id="crystal-handle" icon={<AtSign />} defaultValue="ava" autoComplete="username" />
            </div>
            <CrystalModalFooter>
              <CrystalModalClose asChild>
                <Button type="button" variant="ghost" className="text-white/80 hover:text-white">
                  Cancel
                </Button>
              </CrystalModalClose>
              <FrostButton type="submit" tone="primary" loading={saving} loadingText="Saving…">
                Save changes
              </FrostButton>
            </CrystalModalFooter>
          </form>
        </CrystalModalContent>
      </CrystalModal>
    </>
  );
}
