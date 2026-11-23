import { Textarea } from "@/components/ui/textarea";

export default function TextareaStatesDemo() {
  return (
    <div className="grid w-full max-w-md gap-4">
      <div className="grid gap-1.5">
        <Textarea
          aria-label="Feedback"
          aria-invalid
          aria-describedby="feedback-error"
          defaultValue="meh"
        />
        <p id="feedback-error" className="text-xs text-destructive">
          Feedback must be at least 10 characters.
        </p>
      </div>
      <Textarea aria-label="Disabled" placeholder="Comments are turned off" disabled />
      <Textarea
        aria-label="Fixed height"
        rows={3}
        className="field-sizing-fixed resize-y"
        placeholder="field-sizing-fixed + rows for a fixed, resizable box"
      />
    </div>
  );
}
