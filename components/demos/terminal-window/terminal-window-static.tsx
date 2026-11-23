import { TerminalWindow } from "@/components/dusk/hacker/terminal-window";

export default function TerminalWindowStaticDemo() {
  return (
    <TerminalWindow
      animate={false}
      title="git"
      bodyClassName="h-auto max-h-64"
      className="max-w-xl"
      lines={[
        { type: "command", text: "git log --oneline -3" },
        { text: "b4753b8 (HEAD -> main) Merge pull request #1", className: "text-amber-300" },
        "5567b1f Update dependencies",
        "a46cb9b Add front page and component pages",
      ]}
    />
  );
}
