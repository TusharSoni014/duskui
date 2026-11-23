import { ArrowRight, Mail, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ButtonIconsDemo() {
  return (
    <>
      <Button>
        <Mail />
        Send email
      </Button>
      <Button variant="outline">
        <Plus />
        New project
      </Button>
      <Button variant="secondary" className="group">
        Continue
        <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
      </Button>
    </>
  );
}
