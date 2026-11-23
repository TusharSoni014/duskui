import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectBasicDemo() {
  return (
    <div className="grid w-full max-w-xs gap-2">
      <label htmlFor="fruit" className="text-sm font-medium">
        Favorite fruit
      </label>
      <Select defaultValue="mango">
        <SelectTrigger id="fruit" className="w-full">
          <SelectValue placeholder="Pick a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="mango">Mango</SelectItem>
            <SelectItem value="kiwi">Kiwi</SelectItem>
            <SelectItem value="dragonfruit" disabled>
              Dragonfruit
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
