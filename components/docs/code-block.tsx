import { CopyButton } from "@/components/dusk/button/copy-button";
import { highlight } from "@/lib/source";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  lang?: string;
  title?: string;
  className?: string;
  /** Max height in px before the block scrolls. */
  maxHeight?: number;
}

/** Server-rendered, syntax-highlighted code (Shiki). Ships no JS except the copy button. */
export async function CodeBlock({
  code,
  lang = "tsx",
  title,
  className,
  maxHeight = 480,
}: CodeBlockProps) {
  const html = await highlight(code, lang);

  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/10 bg-zinc-950/70",
        className
      )}
    >
      {title ? (
        <figcaption className="flex h-10 items-center justify-between border-b border-white/10 bg-white/[0.02] pl-4 pr-1.5 font-mono text-xs text-white/50">
          <span className="truncate">{title}</span>
          <CopyButton value={code} className="text-white/50 hover:text-white" />
        </figcaption>
      ) : (
        <CopyButton
          value={code}
          className="absolute right-1.5 top-1.5 z-10 text-white/50 hover:text-white"
        />
      )}
      <div
        className="overflow-auto text-[13px] leading-relaxed [&_code]:font-mono [&_pre]:w-max [&_pre]:min-w-full [&_pre]:bg-transparent! [&_pre]:p-4 [&_pre]:pr-12"
        style={{ maxHeight }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}
