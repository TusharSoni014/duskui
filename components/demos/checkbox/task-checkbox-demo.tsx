import { TaskCheckbox } from "@/components/dusk/checkbox/task-checkbox";

export default function TaskCheckboxDemo() {
  return (
    <div className="grid w-full max-w-sm gap-4 rounded-xl border bg-card p-5">
      <TaskCheckbox label="Write the launch announcement" description="Due today · Marketing" defaultChecked />
      <TaskCheckbox label="Record a 30-second demo video of the new animated components" description="Tomorrow" />
      <TaskCheckbox label="Ship v1.0" description="Friday" />
    </div>
  );
}
