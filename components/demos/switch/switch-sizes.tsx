import { Switch } from "@/components/ui/switch";

export default function SwitchSizesDemo() {
  return (
    <>
      <Switch size="sm" aria-label="Small switch" defaultChecked />
      <Switch aria-label="Default switch" defaultChecked />
      <Switch size="lg" aria-label="Large switch" defaultChecked />
      <Switch aria-label="Disabled switch" disabled />
    </>
  );
}
