import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function TextareaWithLabelDemo() {
  return (
    <div className="grid w-full max-w-md gap-2">
      <label htmlFor="bio" className="text-sm font-medium">
        Bio
      </label>
      <Textarea
        id="bio"
        placeholder="Tell us a little about yourself"
        aria-describedby="bio-hint"
        className="max-h-40"
      />
      <p id="bio-hint" className="text-xs text-muted-foreground">
        Shown on your public profile. Markdown is supported.
      </p>
      <Button size="sm" className="justify-self-end">
        Save bio
      </Button>
    </div>
  );
}
