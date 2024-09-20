import Sidenav from "@/components/Sidenav";
import React, { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-4">
      <Sidenav />
      <div className="size-full p-3">{children}</div>
    </div>
  );
}
