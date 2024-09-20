import Link from "next/link";
import React from "react";
import { RiPuzzleFill } from "react-icons/ri";
import { backgrounds, components } from "./components-list";

export default function Sidenav() {
  return (
    <div className="relative z-20 w-[350px] h-fill p-3 overflow-y-auto">
      <h3 className="font-semibold text-white mb-1">Components</h3>
      {components.map((item, index) => {
        return (
          <Link
            key={index}
            className="text-sm text-white/60 transition hover:text-white flex  justify-center items-center gap-1 w-fit"
            href={item.href}
          >
            <RiPuzzleFill />
            {item.label}
          </Link>
        );
      })}

      <div className="mt-3">
        <h3 className="font-semibold text-white mb-1">Backgrounds</h3>
        {backgrounds.map((item, index) => {
          return (
            <Link
              key={index}
              className="text-sm text-white/60 transition hover:text-white flex  justify-center items-center gap-1 w-fit"
              href={item.href}
            >
              <RiPuzzleFill />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
