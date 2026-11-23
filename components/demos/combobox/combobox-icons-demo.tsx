import { Braces, Coffee, FileCode2, Gem, Hash, Terminal } from "lucide-react";
import { Combobox } from "@/components/dusk/combobox/combobox";

const languages = [
  { value: "ts", label: "TypeScript", description: ".ts", icon: <FileCode2 />, keywords: ["javascript"] },
  { value: "py", label: "Python", description: ".py", icon: <Terminal /> },
  { value: "rs", label: "Rust", description: ".rs", icon: <Braces /> },
  { value: "go", label: "Go", description: ".go", icon: <Hash />, keywords: ["golang"] },
  { value: "rb", label: "Ruby", description: ".rb", icon: <Gem /> },
  { value: "java", label: "Java", description: ".java", icon: <Coffee /> },
];

export default function ComboboxIconsDemo() {
  return (
    <Combobox
      aria-label="Language"
      options={languages}
      defaultValue="ts"
      allowDeselect={false}
      placeholder="Language"
      searchPlaceholder="Filter languages…"
      className="w-64"
    />
  );
}
