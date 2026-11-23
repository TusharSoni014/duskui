import { CalendarDays } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export default function HoverCardBasicDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a href="#" className="rounded-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50">
          @duskui
        </a>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" showArrow>
        <div className="flex gap-4">
          <span
            aria-hidden
            className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/15 font-semibold text-primary"
          >
            D
          </span>
          <div className="grid gap-1">
            <h4 className="text-sm font-semibold">@duskui</h4>
            <p className="text-sm text-muted-foreground">
              Animated React components for shadcn/ui, built with Motion.
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5" aria-hidden />
              Joined November 2025
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
