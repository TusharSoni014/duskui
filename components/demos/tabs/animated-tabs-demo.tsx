import {
  AnimatedTabs,
  AnimatedTabsContent,
  AnimatedTabsList,
  AnimatedTabsPanels,
  AnimatedTabsTrigger,
} from "@/components/dusk/tabs/animated-tabs";

const stats = [
  { label: "Visitors", value: "24.8k" },
  { label: "Signups", value: "1,204" },
  { label: "Conversion", value: "4.9%" },
];

export default function AnimatedTabsDemo() {
  return (
    <AnimatedTabs defaultValue="overview" className="w-full max-w-md">
      <AnimatedTabsList>
        <AnimatedTabsTrigger value="overview">Overview</AnimatedTabsTrigger>
        <AnimatedTabsTrigger value="activity">Activity</AnimatedTabsTrigger>
        <AnimatedTabsTrigger value="settings">Settings</AnimatedTabsTrigger>
      </AnimatedTabsList>
      <AnimatedTabsPanels>
        <AnimatedTabsContent value="overview" className="grid grid-cols-3 gap-2">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border bg-card p-3">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">{s.value}</p>
            </div>
          ))}
        </AnimatedTabsContent>
        <AnimatedTabsContent value="activity" className="rounded-xl border bg-card p-4">
          <ul className="space-y-3 text-sm">
            <li><span className="font-medium text-foreground">Mia</span> deployed <span className="font-mono text-xs">v2.4.0</span></li>
            <li><span className="font-medium text-foreground">Leo</span> merged “Animated tabs”</li>
            <li><span className="font-medium text-foreground">Ava</span> invited 3 teammates</li>
            <li><span className="font-medium text-foreground">Kai</span> rotated the API key</li>
          </ul>
        </AnimatedTabsContent>
        <AnimatedTabsContent value="settings" className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
          Notifications are on for deploys and mentions.
        </AnimatedTabsContent>
      </AnimatedTabsPanels>
    </AnimatedTabs>
  );
}
