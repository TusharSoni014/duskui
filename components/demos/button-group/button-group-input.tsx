import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ButtonGroupInputDemo() {
  return (
    <ButtonGroup className="w-full max-w-md">
      <Select defaultValue="issues">
        <SelectTrigger aria-label="Search in">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="issues">Issues</SelectItem>
          <SelectItem value="pulls">Pull requests</SelectItem>
          <SelectItem value="docs">Docs</SelectItem>
        </SelectContent>
      </Select>
      <Input placeholder="Search…" aria-label="Search query" />
      <Button variant="outline" size="icon" aria-label="Search">
        <SearchIcon />
      </Button>
    </ButtonGroup>
  );
}
