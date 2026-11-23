import { Textarea } from "@/components/ui/textarea";

export default function TextareaBasicDemo() {
  return (
    <Textarea
      aria-label="Message"
      placeholder="Type your message here. The field grows as you write."
      className="max-h-48 w-full max-w-md"
    />
  );
}
