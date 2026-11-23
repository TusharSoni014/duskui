import { Blocks, Bot, Calendar, Camera, Chromium, Figma, Gitlab, Mail, MessageSquare, Music, Slack, Trello, Twitch, Video, Youtube } from "lucide-react";

import { IconCloud, type IconCloudItem } from "@/components/dusk/icon-cloud/icon-cloud";

const icons = [
  [Slack, "Slack"],
  [Figma, "Figma"],
  [Gitlab, "GitLab"],
  [Trello, "Trello"],
  [Chromium, "Chromium"],
  [Youtube, "YouTube"],
  [Twitch, "Twitch"],
  [Mail, "Email"],
  [Calendar, "Calendar"],
  [MessageSquare, "Chat"],
  [Camera, "Camera"],
  [Video, "Video calls"],
  [Music, "Music"],
  [Bot, "Bots"],
  [Blocks, "Plugins"],
] as const;

const items: IconCloudItem[] = icons.map(([Icon, label]) => ({ label, icon: <Icon />, href: "#integrations" }));

export default function IconCloudHero() {
  return (
    <div className="grid w-full items-center gap-6 rounded-xl border border-white/10 bg-background p-6 sm:grid-cols-[1fr_auto] sm:p-10">
      <div>
        <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Connects to the tools you already use</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Each icon is a link. Tab into the cloud and it stops spinning so you can pick one.
        </p>
      </div>
      <IconCloud
        items={items}
        iconSize={36}
        className="mx-auto max-w-[260px]"
        label="Integrations"
        itemClassName="text-white/70 transition-colors hover:text-white"
      />
    </div>
  );
}
