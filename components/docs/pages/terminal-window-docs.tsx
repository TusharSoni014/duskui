import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import TerminalWindowDemo from "@/components/demos/terminal-window/terminal-window-demo";
import TerminalWindowLoopDemo from "@/components/demos/terminal-window/terminal-window-loop";
import TerminalWindowStaticDemo from "@/components/demos/terminal-window/terminal-window-static";
import TerminalWindowOnCompleteDemo from "@/components/demos/terminal-window/terminal-window-on-complete";

const demo = (file: string) => `components/demos/terminal-window/${file}`;

const config: DocConfig = {
  title: "Terminal Window",
  intro:
    "An animated React terminal component: a macOS-style console window that types commands character by character, reveals their output, auto-scrolls and blinks a cursor. Script a session with an array of lines — perfect for install instructions, CLI landing pages and hacker-themed hero sections. Built with Tailwind CSS and Motion.",
  tags: ["Typing animation", "Real text in the DOM", "Loop & replay", "onComplete callback", "prefers-reduced-motion"],
  hero: { Demo: TerminalWindowDemo, file: demo("terminal-window-demo.tsx"), minHeight: 400 },
  install: {
    registry: "terminal-window",
    source: "components/dusk/hacker/terminal-window.tsx",
    deps: "motion lucide-react",
  },
  usage: {
    filename: "install-steps.tsx",
    code: `import { TerminalWindow } from "@/components/dusk/hacker/terminal-window"

export function InstallSteps() {
  return (
    <TerminalWindow
      title="zsh"
      lines={[
        { type: "command", text: "npm install motion" },
        "added 3 packages in 1s",
        { text: "✓ Done", className: "text-primary" },
      ]}
    />
  )
}`,
  },
  examples: [
    {
      id: "loop",
      title: "Custom prompt & loop",
      description: (
        <>
          Set a <Code>prompt</Code> for the whole window (or per line), <Code>loop</Code> to replay forever,
          and tune each line with <Code>delay</Code>, <Code>typingSpeed</Code> and <Code>className</Code>.
        </>
      ),
      Demo: TerminalWindowLoopDemo,
      file: demo("terminal-window-loop.tsx"),
      minHeight: 360,
    },
    {
      id: "static",
      title: "Static",
      description: (
        <>
          <Code>animate=&#123;false&#125;</Code> renders the finished session straight away — useful for docs
          and code samples. Make the body fit its content with <Code>bodyClassName</Code>.
        </>
      ),
      Demo: TerminalWindowStaticDemo,
      file: demo("terminal-window-static.tsx"),
      minHeight: 260,
    },
    {
      id: "on-complete",
      title: "onComplete",
      description: (
        <>
          <Code>onComplete</Code> fires when the last line is shown (on every pass when looping), so you can
          reveal the next step of a page. Use the replay button in the title bar to run it again.
        </>
      ),
      Demo: TerminalWindowOnCompleteDemo,
      file: demo("terminal-window-on-complete.tsx"),
      minHeight: 340,
    },
  ],
  api: {
    intro: (
      <>
        A <Code>TerminalLine</Code> is a string (an output line) or{" "}
        <Code>{"{ type?: \"command\" | \"output\", text, prompt?, delay?, typingSpeed?, className? }"}</Code>.
        The window also accepts any <Code>&lt;div&gt;</Code> prop.
      </>
    ),
    props: [
      { name: "lines", type: "TerminalLine[]", description: "The session to play. Restarts only when its content changes." },
      { name: "title", type: "ReactNode", default: '"bash"', description: "Text in the title bar." },
      { name: "prompt", type: "string", default: '"$"', description: "Prompt shown before commands." },
      { name: "typingSpeed", type: "number", default: "42", description: "Milliseconds per typed character (slightly randomized)." },
      { name: "commandDelay", type: "number", default: "550", description: "Pause before each command starts typing, in ms." },
      { name: "outputDelay", type: "number", default: "110", description: "Pause before each output line appears, in ms." },
      { name: "startDelay", type: "number", default: "350", description: "Pause before the first line, in ms." },
      { name: "animate", type: "boolean", default: "true", description: "Set to false to show the finished session immediately." },
      { name: "startOnView", type: "boolean", default: "true", description: "Wait until the window is on screen; typing also pauses off-screen." },
      { name: "loop", type: "boolean", default: "false", description: "Replay the session forever." },
      { name: "loopDelay", type: "number", default: "3000", description: "Pause between loops, in ms." },
      { name: "replayable", type: "boolean", default: "true", description: "Show a replay button in the title bar when finished." },
      { name: "showPrompt", type: "boolean", default: "true", description: "Show an idle prompt with a blinking cursor after the last line." },
      { name: "onComplete", type: "() => void", description: "Called each time the session finishes." },
      { name: "bodyClassName", type: "string", default: '"h-72"', description: "Classes for the scrollable body; set the height here." },
      { name: "label", type: "string", default: '"Terminal"', description: "Accessible name of the terminal region." },
    ],
  },
  accessibility: [
    "The full transcript is always rendered as visually hidden text, so search engines index it and screen readers read it in one go instead of character by character.",
    "The animated copy is aria-hidden and nothing is announced while typing (no aria-live chatter).",
    "The body is a keyboard-focusable scroll region inside a labelled region landmark; auto-scroll stops following if you scroll up.",
    "With prefers-reduced-motion the finished session appears at once and the cursor stops blinking. The cursor blinks at about 1 Hz.",
    "Typing pauses while the window is off-screen or the tab is hidden, and every timer is cleared on unmount.",
  ],
};

export function TerminalWindowDocs() {
  return <ComponentDocs config={config} />;
}
