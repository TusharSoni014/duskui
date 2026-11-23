import { Input } from "@/components/ui/input";

export default function InputWithLabelDemo() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <label htmlFor="team-name" className="text-sm font-medium">
        Team name
      </label>
      <Input id="team-name" placeholder="Acme Inc." aria-describedby="team-name-hint" />
      <p id="team-name-hint" className="text-xs text-muted-foreground">
        Visible to everyone in your workspace.
      </p>
    </div>
  );
}
