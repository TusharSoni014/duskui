import { AutoResizeTextarea } from "@/components/dusk/textarea/auto-resize-textarea";

export default function AutoResizeTextareaDemo() {
  return (
    <div className="grid w-full max-w-md gap-2">
      <label htmlFor="release-notes" className="text-sm font-medium">
        Release notes
      </label>
      <AutoResizeTextarea
        id="release-notes"
        placeholder="What changed in this release?"
        maxLength={180}
        minRows={2}
        maxRows={7}
        defaultValue={"Animated select, radio cards and a chat input.\nThe list springs open from the trigger."}
      />
    </div>
  );
}
