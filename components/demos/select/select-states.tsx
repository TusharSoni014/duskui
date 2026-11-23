import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const roles = ["Viewer", "Editor", "Admin"];

function RoleItems() {
  return roles.map((role) => (
    <SelectItem key={role} value={role.toLowerCase()}>
      {role}
    </SelectItem>
  ));
}

export default function SelectStatesDemo() {
  return (
    <div className="grid w-full max-w-xs gap-4">
      <Select defaultValue="editor">
        <SelectTrigger size="sm" className="w-full" aria-label="Role (small)">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <RoleItems />
        </SelectContent>
      </Select>
      <div className="grid gap-1.5">
        <Select>
          <SelectTrigger className="w-full" aria-label="Role" aria-invalid aria-describedby="role-error">
            <SelectValue placeholder="Choose a role" />
          </SelectTrigger>
          <SelectContent>
            <RoleItems />
          </SelectContent>
        </Select>
        <p id="role-error" className="text-xs text-destructive">
          Pick a role to continue.
        </p>
      </div>
      <Select disabled defaultValue="viewer">
        <SelectTrigger className="w-full" aria-label="Role (disabled)">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <RoleItems />
        </SelectContent>
      </Select>
    </div>
  );
}
