import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div className="w-full h-fill flex justify-center items-center flex-col">
      <p>Contact me at Twitter</p>
      <Link target="_blank" href="https://www.x.com/tusharsoni014" className="text-blue-500 underline">
        x.com/tusharsoni014
      </Link>
    </div>
  );
}
