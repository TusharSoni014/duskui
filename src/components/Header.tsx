"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Dialog, DialogContent } from "./ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import Image from "next/image";
// import { RiPuzzleFill } from "react-icons/ri";

export default function Header() {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="sticky top-0 z-50 flex justify-between items-center w-full border-b border-white/10 bg-white/5 backdrop-blur-md p-3 h-16">
      <Link href="/">
        <Image
          alt="DuskUI"
          src="https://pub-f215723903f74ba688c6a4a886cd3abb.r2.dev/duskui.svg"
          height={25}
          width={25}
          className="[filter:invert(100%)]"
        />
      </Link>
      <div className="__links flex justify-cente items-center gap-3">
        <Link
          href="/components"
          className="text-white/70 transition-colors hover:text-white text-sm"
        >
          Components
        </Link>
        <div className="">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild className="outline-none">
              <Button className="px-0 bg-white/5 hover:bg-white/10 w-[220px] border">
                <Input
                  placeholder="🔍 Search UI Components or pages..."
                  className="bg-transparent focus-visible:ring-0 w-full text-xs text-white pointer-events-none"
                />
              </Button>
            </DialogTrigger>
            <DialogContent enableCross={false} className="p-0">
              <Command className="rounded-lg border shadow-md md:min-w-[450px]">
                <CommandInput placeholder="Search any component or page..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  {/* <CommandGroup heading="Components"> */}
                  {/* <CommandItem>
                      <RiPuzzleFill className="mr-2 h-4 w-4 text-white/40" />
                      <span>Calendar</span>
                    </CommandItem>
                    <CommandItem>
                      <RiPuzzleFill className="mr-2 h-4 w-4 text-white/40" />
                      <span>Search Emoji</span>
                    </CommandItem> */}
                  {/* </CommandGroup> */}
                  {/* <CommandSeparator /> */}
                  {/* <CommandGroup heading="Settings">
              <CommandItem>
                <PersonIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <EnvelopeClosedIcon className="mr-2 h-4 w-4" />
                <span>Mail</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <GearIcon className="mr-2 h-4 w-4" />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup> */}
                </CommandList>
              </Command>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
