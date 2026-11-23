import { Bookmark, Star } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

export default function ToggleDemo() {
  return (
    <div className="flex items-center gap-3">
      <Toggle aria-label="Star repository" defaultPressed>
        <Star />
      </Toggle>
      <Toggle variant="outline" aria-label="Bookmark">
        <Bookmark /> Bookmark
      </Toggle>
      <Toggle size="sm" disabled aria-label="Disabled">
        <Star />
      </Toggle>
    </div>
  );
}
