"use client";

import * as React from "react";
import { useInView, usePageInView, useReducedMotion } from "motion/react";
import { RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * One line of a terminal session.
 * A plain string is an output line. Objects can be typed `"command"` lines
 * (typed character by character after a prompt) or `"output"` lines (revealed at once).
 */
export type TerminalLine =
  | string
  | {
      /** `"command"` lines are typed after the prompt; `"output"` lines appear at once. Default `"output"`. */
      type?: "command" | "output";
      text: string;
      /** Overrides the window's prompt for this command. */
      prompt?: string;
      /** Milliseconds to wait before this line starts. */
      delay?: number;
      /** Milliseconds per typed character for this command. */
      typingSpeed?: number;
      /** Extra classes for this line, e.g. a success or error color. */
      className?: string;
    };

export interface TerminalWindowProps
  extends Omit<React.ComponentProps<"div">, "title" | "children"> {
  /** The session to play. Hoisting or memoizing it is not required; it restarts only when its content changes. */
  lines: TerminalLine[];
  /** Text in the title bar. */
  title?: React.ReactNode;
  /** Default prompt shown before commands. */
  prompt?: string;
  /** Milliseconds per typed character (slightly randomized so it feels human). */
  typingSpeed?: number;
  /** Pause before a command starts typing, in ms. */
  commandDelay?: number;
  /** Pause before each output line appears, in ms. */
  outputDelay?: number;
  /** Pause before the very first line, in ms. */
  startDelay?: number;
  /** Set to `false` to render the finished session immediately. */
  animate?: boolean;
  /** Wait until the window scrolls into view before typing. */
  startOnView?: boolean;
  /** Replay the session forever. */
  loop?: boolean;
  /** Pause between loops, in ms. */
  loopDelay?: number;
  /** Show a replay button in the title bar once the session finishes. */
  replayable?: boolean;
  /** Show an idle prompt with a blinking cursor after the last line. */
  showPrompt?: boolean;
  /** Called every time the session finishes (each pass when looping). */
  onComplete?: () => void;
  /** Classes for the scrollable body. Set the height here (default `h-72`). */
  bodyClassName?: string;
  /** Accessible name for the terminal region. */
  label?: string;
}

type Line = {
  type: "command" | "output";
  text: string;
  prompt: string;
  delay?: number;
  typingSpeed?: number;
  className?: string;
};

type Progress = { line: number; char: number };

const START: Progress = { line: 0, char: 0 };
/** Pause after a command is fully typed, like pressing Enter. */
const ENTER_DELAY = 380;

const CURSOR_CSS = `
@keyframes dusk-terminal-blink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
.dusk-terminal-cursor[data-blink] { animation: dusk-terminal-blink 1.06s step-end infinite }
@media (prefers-reduced-motion: reduce) { .dusk-terminal-cursor[data-blink] { animation: none } }
`;

function normalize(lines: TerminalLine[], prompt: string): Line[] {
  return lines.map((line) =>
    typeof line === "string"
      ? { type: "output", text: line, prompt }
      : { ...line, type: line.type ?? "output", prompt: line.prompt ?? prompt }
  );
}

function Cursor({ blink }: { blink: boolean }) {
  return (
    <span
      data-blink={blink || undefined}
      className="dusk-terminal-cursor ml-px inline-block h-[1.15em] w-[0.6em] translate-y-[0.2em] bg-primary/90"
    />
  );
}

/**
 * A terminal window that types out a scripted session: commands are typed
 * character by character after a prompt, output lines appear underneath,
 * the body auto-scrolls and a cursor blinks at the end.
 *
 * The full transcript is always in the DOM (as a visually hidden `<pre>`), so
 * search engines and screen readers get the text without waiting for the
 * animation. Under reduced motion the finished session is shown at once.
 */
export function TerminalWindow({
  lines,
  title = "bash",
  prompt = "$",
  typingSpeed = 42,
  commandDelay = 550,
  outputDelay = 110,
  startDelay = 350,
  animate = true,
  startOnView = true,
  loop = false,
  loopDelay = 3000,
  replayable = true,
  showPrompt = true,
  onComplete,
  bodyClassName,
  label = "Terminal",
  className,
  ...props
}: TerminalWindowProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const stickToBottom = React.useRef(true);
  const onCompleteRef = React.useRef(onComplete);

  const reduceMotion = useReducedMotion();
  const pageVisible = usePageInView();
  const inView = useInView(rootRef, { amount: 0.3 });

  // A content signature lets callers pass inline arrays without restarting every render.
  const signature = JSON.stringify([prompt, lines]);
  const items = React.useMemo(() => {
    const [p, raw] = JSON.parse(signature) as [string, TerminalLine[]];
    return normalize(raw, p);
  }, [signature]);

  const [progress, setProgress] = React.useState<Progress>(() =>
    animate ? START : { line: items.length, char: 0 }
  );

  // Restart when the script changes (adjusting state during render, no effect needed).
  const [prevSignature, setPrevSignature] = React.useState(signature);
  if (prevSignature !== signature) {
    setPrevSignature(signature);
    setProgress(animate ? START : { line: items.length, char: 0 });
  }

  const instant = !animate || reduceMotion === true;
  const done = progress.line >= items.length;
  const running = (!startOnView || inView) && pageVisible;

  React.useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  // The typing state machine: one timeout per step, always cleaned up.
  React.useEffect(() => {
    let delay: number;
    let next: (p: Progress) => Progress;

    if (instant) {
      if (done) return;
      delay = 0;
      next = () => ({ line: items.length, char: 0 });
    } else if (!running) {
      return;
    } else if (done) {
      if (!loop) return;
      delay = loopDelay;
      next = () => START;
    } else {
      const item = items[progress.line];
      const first = progress.line === 0;
      if (item.type === "output") {
        delay = item.delay ?? (first ? startDelay : outputDelay);
        next = (p) => ({ line: p.line + 1, char: 0 });
      } else if (progress.char === 0 && item.text.length > 0) {
        delay = item.delay ?? (first ? startDelay : commandDelay);
        next = (p) => ({ ...p, char: 1 });
      } else if (progress.char < item.text.length) {
        const speed = item.typingSpeed ?? typingSpeed;
        delay = speed * (0.55 + Math.random() * 0.9);
        next = (p) => ({ ...p, char: p.char + 1 });
      } else {
        delay = ENTER_DELAY;
        next = (p) => ({ line: p.line + 1, char: 0 });
      }
    }

    const restart = done;
    const timer = setTimeout(() => {
      if (restart) stickToBottom.current = true;
      setProgress(next);
    }, delay);
    return () => clearTimeout(timer);
  }, [
    progress,
    items,
    instant,
    running,
    done,
    loop,
    loopDelay,
    startDelay,
    outputDelay,
    commandDelay,
    typingSpeed,
  ]);

  React.useEffect(() => {
    if (done) onCompleteRef.current?.();
  }, [done]);

  // Follow new output unless the reader scrolled up.
  React.useLayoutEffect(() => {
    const body = bodyRef.current;
    if (body && stickToBottom.current) body.scrollTop = body.scrollHeight;
  }, [progress]);

  const replay = () => {
    stickToBottom.current = true;
    setProgress(START);
  };

  const transcript = items
    .map((item) => (item.type === "command" ? `${item.prompt} ${item.text}` : item.text))
    .join("\n");

  const typing =
    !done && items[progress.line]?.type === "command" && progress.char > 0 &&
    progress.char < items[progress.line].text.length;

  return (
    <div
      ref={rootRef}
      role="region"
      aria-label={label}
      data-slot="terminal-window"
      className={cn(
        "w-full overflow-hidden rounded-xl border border-white/10 bg-[oklch(0.08_0.015_150)] font-mono text-[13px] leading-relaxed text-foreground shadow-2xl shadow-black/40",
        className
      )}
      {...props}
    >
      <style href="duskui-terminal-window" precedence="duskui">
        {CURSOR_CSS}
      </style>

      <div className="flex h-10 items-center gap-3 border-b border-white/10 bg-white/[0.03] px-4">
        <div className="flex w-12 shrink-0 gap-1.5" aria-hidden>
          <span className="size-3 rounded-full bg-[#ff5f57]/90" />
          <span className="size-3 rounded-full bg-[#febc2e]/90" />
          <span className="size-3 rounded-full bg-[#28c840]/90" />
        </div>
        <div className="min-w-0 flex-1 truncate text-center text-xs text-muted-foreground">{title}</div>
        <div className="flex w-12 shrink-0 justify-end">
          {replayable && done && !loop && !instant && (
            <button
              type="button"
              onClick={replay}
              aria-label="Replay terminal session"
              className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-white/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 [&_svg]:size-3.5"
            >
              <RotateCcw />
            </button>
          )}
        </div>
      </div>

      <div
        ref={bodyRef}
        tabIndex={0}
        onScroll={(e) => {
          const el = e.currentTarget;
          stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
        }}
        className={cn(
          "h-72 overflow-y-auto p-4 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50 [scrollbar-color:rgb(255_255_255/0.15)_transparent] [scrollbar-width:thin]",
          bodyClassName
        )}
      >
        {/* Full text for search engines and assistive tech; the animated copy below is decorative. */}
        <pre className="sr-only">{transcript}</pre>

        <div aria-hidden>
          {items.map((item, i) => {
            if (i > progress.line) return null;
            const current = i === progress.line;

            if (current && item.type === "output") {
              return (
                <div key={i} className="min-h-[1lh]">
                  <Cursor blink />
                </div>
              );
            }

            const text = current ? item.text.slice(0, progress.char) : item.text;
            return (
              <div key={i} className={cn("min-h-[1lh] whitespace-pre-wrap break-words", item.className)}>
                {item.type === "command" && (
                  <span className="select-none text-primary">{item.prompt} </span>
                )}
                <span className={item.type === "command" ? "text-foreground" : "text-muted-foreground"}>
                  {text}
                </span>
                {current && <Cursor blink={!typing} />}
              </div>
            );
          })}

          {done && showPrompt && (
            <div className="min-h-[1lh]">
              <span className="select-none text-primary">{prompt} </span>
              <Cursor blink />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
