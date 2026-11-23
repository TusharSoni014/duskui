import { Bell, Lock, User } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const sections = [
  { value: "profile", icon: User, title: "Profile", body: "Name, avatar and public bio." },
  { value: "security", icon: Lock, title: "Security", body: "Password, passkeys and two-factor authentication." },
  { value: "alerts", icon: Bell, title: "Notifications", body: "Email and push preferences for mentions and deploys." },
];

export default function AccordionMultipleDemo() {
  return (
    <Accordion type="multiple" defaultValue={["profile", "security"]} className="w-full max-w-md rounded-xl border bg-card px-4">
      {sections.map(({ value, icon: Icon, title, body }) => (
        <AccordionItem key={value} value={value}>
          <AccordionTrigger>
            <span className="flex items-center gap-2.5">
              <Icon className="size-4 text-muted-foreground" aria-hidden />
              {title}
            </span>
          </AccordionTrigger>
          <AccordionContent className="pl-6.5">{body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
