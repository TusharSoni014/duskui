"use client";

import * as React from "react";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

export default function MenubarCheckboxesDemo() {
  const [minimap, setMinimap] = React.useState(true);
  const [wordWrap, setWordWrap] = React.useState(false);
  const [lineNumbers, setLineNumbers] = React.useState(true);
  const [theme, setTheme] = React.useState("dusk");
  const [zoom, setZoom] = React.useState("100");

  return (
    <div className="flex flex-col items-center gap-4">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem checked={minimap} onCheckedChange={setMinimap}>
              Minimap
            </MenubarCheckboxItem>
            <MenubarCheckboxItem checked={wordWrap} onCheckedChange={setWordWrap}>
              Word wrap <MenubarShortcut>⌥Z</MenubarShortcut>
            </MenubarCheckboxItem>
            <MenubarCheckboxItem checked={lineNumbers} onCheckedChange={setLineNumbers}>
              Line numbers
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarLabel inset>Zoom</MenubarLabel>
            <MenubarRadioGroup value={zoom} onValueChange={setZoom}>
              <MenubarRadioItem value="90">90%</MenubarRadioItem>
              <MenubarRadioItem value="100">100%</MenubarRadioItem>
              <MenubarRadioItem value="125">125%</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Theme</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup value={theme} onValueChange={setTheme}>
              <MenubarRadioItem value="dusk">Dusk</MenubarRadioItem>
              <MenubarRadioItem value="midnight">Midnight</MenubarRadioItem>
              <MenubarRadioItem value="terminal">Terminal</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {[minimap && "minimap", wordWrap && "wrap", lineNumbers && "line numbers"].filter(Boolean).join(" · ") ||
          "no extras"}{" "}
        — {theme} at {zoom}%
      </p>
    </div>
  );
}
