import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const sections = [
  "Using the service",
  "Your content",
  "Privacy",
  "Payments and refunds",
  "Termination",
  "Liability",
  "Changes to these terms",
];

export default function DialogScrollableDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Read the terms</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Terms of service</DialogTitle>
          <DialogDescription>Last updated November 2026.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          {sections.map((title, i) => (
            <section key={title}>
              <h3 className="mb-1 font-medium text-foreground">
                {i + 1}. {title}
              </h3>
              <p>
                This is placeholder legal copy to show how long content scrolls inside the dialog
                instead of overflowing the screen. The header and close button stay inside the
                surface and the page behind stays locked.
              </p>
            </section>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>I agree</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
