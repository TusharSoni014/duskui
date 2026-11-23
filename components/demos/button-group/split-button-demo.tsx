"use client";

import * as React from "react";
import { GitMergeIcon, GitPullRequestArrowIcon, LayersIcon } from "lucide-react";
import { toast } from "sonner";

import { SplitButton } from "@/components/dusk/button-group/split-button";

const actions = [
  {
    value: "merge",
    label: "Merge pull request",
    description: "All commits are added to the base branch with a merge commit.",
    icon: <GitMergeIcon />,
  },
  {
    value: "squash",
    label: "Squash and merge",
    description: "The commits are combined into one commit on the base branch.",
    icon: <LayersIcon />,
  },
  {
    value: "rebase",
    label: "Rebase and merge",
    description: "The commits are rebased and added to the base branch.",
    icon: <GitPullRequestArrowIcon />,
  },
];

export default function SplitButtonDemo() {
  const [loading, setLoading] = React.useState(false);

  return (
    <SplitButton
      actions={actions}
      loading={loading}
      menuLabel="Choose a merge method"
      onAction={(value) => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          toast.success(`${actions.find((a) => a.value === value)?.label} done`);
        }, 900);
      }}
    />
  );
}
