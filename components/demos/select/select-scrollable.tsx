import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const zones = [
  {
    label: "Americas",
    items: [
      ["america/los_angeles", "Pacific Time (PT)"],
      ["america/denver", "Mountain Time (MT)"],
      ["america/chicago", "Central Time (CT)"],
      ["america/new_york", "Eastern Time (ET)"],
      ["america/sao_paulo", "Brasília Time (BRT)"],
    ],
  },
  {
    label: "Europe & Africa",
    items: [
      ["europe/london", "Greenwich Mean Time (GMT)"],
      ["europe/berlin", "Central European Time (CET)"],
      ["europe/athens", "Eastern European Time (EET)"],
      ["africa/nairobi", "East Africa Time (EAT)"],
    ],
  },
  {
    label: "Asia & Pacific",
    items: [
      ["asia/kolkata", "India Standard Time (IST)"],
      ["asia/shanghai", "China Standard Time (CST)"],
      ["asia/tokyo", "Japan Standard Time (JST)"],
      ["australia/sydney", "Australian Eastern Time (AET)"],
    ],
  },
];

export default function SelectScrollableDemo() {
  return (
    <Select name="timezone">
      <SelectTrigger className="w-72" aria-label="Timezone">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent position="popper" className="max-h-72">
        {zones.map((zone, i) => (
          <SelectGroup key={zone.label}>
            {i > 0 && <SelectSeparator />}
            <SelectLabel>{zone.label}</SelectLabel>
            {zone.items.map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
