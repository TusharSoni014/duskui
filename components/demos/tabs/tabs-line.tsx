import { Code2, Eye, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TabsLineDemo() {
  return (
    <Tabs defaultValue="preview" className="w-full max-w-md">
      <TabsList variant="line">
        <TabsTrigger value="preview">
          <Eye /> Preview
        </TabsTrigger>
        <TabsTrigger value="code">
          <Code2 /> Code
        </TabsTrigger>
        <TabsTrigger value="comments">
          <MessageSquare /> Comments
        </TabsTrigger>
      </TabsList>
      <TabsContent value="preview" className="pt-2 text-sm text-muted-foreground">
        The rendered component, live.
      </TabsContent>
      <TabsContent value="code" className="pt-2 text-sm text-muted-foreground">
        Copy-paste source with syntax highlighting.
      </TabsContent>
      <TabsContent value="comments" className="pt-2 text-sm text-muted-foreground">
        3 comments from your team.
      </TabsContent>
    </Tabs>
  );
}
