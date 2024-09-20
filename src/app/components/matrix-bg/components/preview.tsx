import React from "react";
import MatrixRain from "./matrix-bg";

export default function Preview() {
  return (
    <div className="relative w-full h-[300px] flex justify-center items-center ">
      <MatrixRain height={300} />
      <p className="text-green-500 text-xl font-bold shadow-lg [text-shadow:0_0_10px_rgba(0,255,0,1)]">
        Anything can render here
      </p>
    </div>
  );
}
