"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Archive, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { undoToast } from "@/components/dusk/toast/undo-toast";
import { animatedToast } from "@/components/dusk/toast/animated-toast";

const initialEmails = [
  { id: 1, from: "Ada Kim", subject: "Motion specs for the onboarding flow" },
  { id: 2, from: "Leo Park", subject: "Re: Q3 roadmap review" },
  { id: 3, from: "Vercel", subject: "Your deployment is ready" },
];

export default function UndoToastDemo() {
  const [emails, setEmails] = React.useState(initialEmails);

  const archive = (email: (typeof initialEmails)[number]) => {
    // Optimistic: remove now, commit later.
    setEmails((list) => list.filter((e) => e.id !== email.id));
    undoToast({
      title: "Conversation archived",
      description: email.subject,
      onUndo: () =>
        setEmails((list) =>
          list.some((e) => e.id === email.id) ? list : [...list, email].sort((a, b) => a.id - b.id)
        ),
      onCommit: () => animatedToast.info("Archived for good", { duration: 2500 }),
    });
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <ul className="overflow-hidden rounded-xl border">
        <AnimatePresence initial={false}>
          {emails.map((email) => (
            <motion.li
              key={email.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", duration: 0.35, bounce: 0 }}
              className="overflow-hidden border-b last:border-b-0"
            >
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{email.from}</p>
                  <p className="truncate text-sm text-muted-foreground">{email.subject}</p>
                </div>
                <Button size="icon-sm" variant="ghost" aria-label={`Archive “${email.subject}”`} onClick={() => archive(email)}>
                  <Archive />
                </Button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
        {emails.length === 0 && <li className="px-4 py-6 text-center text-sm text-muted-foreground">Inbox zero.</li>}
      </ul>
      <Button variant="ghost" size="sm" className="self-start" onClick={() => setEmails(initialEmails)}>
        <RotateCcw />
        Reset inbox
      </Button>
    </div>
  );
}
