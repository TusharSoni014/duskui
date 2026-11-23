import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export default function ResizableBasicDemo() {
  return (
    <ResizablePanelGroup orientation="horizontal" className="max-h-64 max-w-lg rounded-xl border">
      <ResizablePanel defaultSize="50" minSize="20">
        <div className="flex h-64 items-center justify-center p-6">
          <span className="text-sm font-medium">One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="50" minSize="20">
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize="40" minSize="20">
            <div className="flex h-full items-center justify-center p-6">
              <span className="text-sm font-medium">Two</span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="60" minSize="20">
            <div className="flex h-full items-center justify-center p-6">
              <span className="text-sm font-medium">Three</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
