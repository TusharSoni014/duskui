import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const sections = [
  { value: "general", label: "General", body: "Workspace name, URL and default language." },
  { value: "members", label: "Members", body: "Invite people and manage their roles." },
  { value: "billing", label: "Billing", body: "Plan, invoices and payment method." },
];

export default function TabsVerticalDemo() {
  return (
    <Tabs defaultValue="general" orientation="vertical" className="w-full max-w-md gap-6">
      <TabsList variant="line" className="w-36">
        {sections.map((s) => (
          <TabsTrigger key={s.value} value={s.value}>
            {s.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {sections.map((s) => (
        <TabsContent key={s.value} value={s.value} className="p-1">
          <h3 className="font-medium">{s.label}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
        </TabsContent>
      ))}
    </Tabs>
  );
}
