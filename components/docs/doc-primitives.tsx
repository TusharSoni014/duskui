import * as React from "react";
import { cn } from "@/lib/utils";

export function DocHeading({
  as: Tag = "h2",
  id,
  children,
  className,
}: {
  as?: "h2" | "h3";
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Tag
      id={id}
      className={cn(
        "group scroll-mt-24 font-semibold tracking-tight text-white",
        Tag === "h2"
          ? "mt-16 mb-4 border-b border-white/10 pb-3 text-2xl"
          : "mt-10 mb-2 text-lg",
        className
      )}
    >
      <a href={`#${id}`} className="outline-none focus-visible:underline">
        {children}
        <span
          aria-hidden
          className="ml-2 text-primary/0 transition-colors group-hover:text-primary/60"
        >
          #
        </span>
      </a>
    </Tag>
  );
}

export function DocText({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("leading-7 text-white/60 [&:not(:first-child)]:mt-3", className)}>{children}</p>;
}

export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[0.85em] text-white/85">
      {children}
    </code>
  );
}

export type PropRow = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-white/[0.03] text-white/60">
          <tr>
            <th scope="col" className="px-4 py-2.5 font-medium">Prop</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Type</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Default</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rows.map((row) => (
            <tr key={row.name} className="align-top transition-colors hover:bg-white/[0.02]">
              <td className="px-4 py-3 font-mono text-[13px] text-primary">{row.name}</td>
              <td className="max-w-56 px-4 py-3 font-mono text-[12px] text-white/55">{row.type}</td>
              <td className="px-4 py-3 font-mono text-[12px] text-white/40">{row.default ?? "—"}</td>
              <td className="px-4 py-3 text-white/60">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
