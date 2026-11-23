import { TerminalWindow } from "@/components/dusk/hacker/terminal-window";

export default function TerminalWindowLoopDemo() {
  return (
    <TerminalWindow
      title="root@dusk: ~"
      prompt="root@dusk:~#"
      loop
      loopDelay={2500}
      bodyClassName="h-56"
      className="max-w-xl"
      lines={[
        { type: "command", text: "nmap -sV 10.0.0.42" },
        "Starting Nmap 7.95",
        "PORT     STATE SERVICE VERSION",
        "22/tcp   open  ssh     OpenSSH 9.6",
        "443/tcp  open  https   nginx 1.27",
        { type: "command", text: "ssh deploy@10.0.0.42", typingSpeed: 70 },
        { text: "Last login: Mon Nov 23 09:14 from 10.0.0.7", className: "text-primary", delay: 900 },
      ]}
    />
  );
}
