"use client";

import * as React from "react";
import { MessageSquare, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentLoader } from "@/components/dusk/skeleton/content-loader";
import { SkeletonAvatarRow, SkeletonText } from "@/components/dusk/skeleton/skeleton-presets";

const comments = [
  { initials: "AK", name: "Ada Kim", time: "2m", text: "The new spring on the drawer feels so much better. Shipping it?" },
  { initials: "LP", name: "Leo Park", time: "9m", text: "Yes, after the reduced-motion pass." },
  {
    initials: "ID",
    name: "Ines Duarte",
    time: "1h",
    text: "Left two notes on the focus order in the dialog. Otherwise looks great, nice work on the height animation.",
  },
];

export default function ContentLoaderDemo() {
  const [loading, setLoading] = React.useState(true);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  const load = React.useCallback(() => {
    setLoading(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setLoading(false), 1800);
  }, []);

  React.useEffect(() => {
    timer.current = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer.current);
  }, []);

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <section className="w-full rounded-xl border bg-card p-4" aria-labelledby="comments-heading">
        <h3 id="comments-heading" className="mb-4 flex items-center gap-2 text-sm font-medium">
          <MessageSquare className="size-4 text-muted-foreground" aria-hidden />
          Comments
        </h3>
        <ContentLoader
          loading={loading}
          loadingLabel="Loading comments"
          stagger
          contentClassName="grid gap-5"
          skeleton={
            <div className="grid gap-5">
              <div className="grid gap-3">
                <SkeletonAvatarRow avatarClassName="size-8" />
                <SkeletonText lines={2} className="pl-11" />
              </div>
              <div className="grid gap-3">
                <SkeletonAvatarRow avatarClassName="size-8" />
                <SkeletonText lines={1} className="pl-11" lastLineClassName="w-1/2" />
              </div>
            </div>
          }
        >
          {comments.map((comment) => (
            <article key={comment.name} className="flex gap-3">
              <span
                aria-hidden
                className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-xs font-medium text-muted-foreground"
              >
                {comment.initials}
              </span>
              <div className="grid gap-1">
                <p className="text-sm">
                  <span className="font-medium">{comment.name}</span>{" "}
                  <span className="text-muted-foreground">· {comment.time}</span>
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">{comment.text}</p>
              </div>
            </article>
          ))}
        </ContentLoader>
      </section>
      <Button variant="ghost" size="sm" onClick={load} aria-disabled={loading || undefined} className="aria-disabled:opacity-50">
        <RotateCw />
        Reload
      </Button>
    </div>
  );
}
