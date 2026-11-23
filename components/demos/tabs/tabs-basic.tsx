import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TabsBasicDemo() {
  return (
    <Tabs defaultValue="account" className="w-full max-w-sm">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="grid gap-3 rounded-xl border bg-card p-4">
        <label className="grid gap-1.5 text-sm font-medium">
          Name
          <Input defaultValue="Ada Lovelace" />
        </label>
        <Button size="sm" className="justify-self-end">Save</Button>
      </TabsContent>
      <TabsContent value="password" className="grid gap-3 rounded-xl border bg-card p-4">
        <label className="grid gap-1.5 text-sm font-medium">
          New password
          <Input type="password" autoComplete="new-password" />
        </label>
        <Button size="sm" className="justify-self-end">Update password</Button>
      </TabsContent>
    </Tabs>
  );
}
