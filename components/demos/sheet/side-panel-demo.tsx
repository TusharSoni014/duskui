"use client";

import * as React from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidePanel } from "@/components/dusk/sheet/side-panel";

const comments = [
  { name: "Ada Kim", time: "2m", text: "Love the new spring on the dock — feels much snappier." },
  { name: "Sam Patel", time: "18m", text: "Can we try a shorter exit on the dialog? 150ms maybe." },
  { name: "Lee Wong", time: "1h", text: "Reduced motion mode looks right on my end." },
  { name: "Maya Ruiz", time: "3h", text: "Shipping this to staging after lunch." },
];

export default function SidePanelDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <SidePanel
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button variant="outline">
          <MessageSquare />
          Comments
        </Button>
      }
      title="Comments"
      description="Drag the edge handle or header to the right, or flick, to close."
      footer={<Button onClick={() => setOpen(false)}>Done</Button>}
    >
      <ul className="grid gap-3">
        {comments.map((comment) => (
          <li key={comment.name} className="rounded-xl border bg-card/50 p-3">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">{comment.name}</span>
              <span className="text-muted-foreground">{comment.time}</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{comment.text}</p>
          </li>
        ))}
      </ul>
    </SidePanel>
  );
}
