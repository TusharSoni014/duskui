import { ImageResponse } from "next/og";

import { logoDataUri } from "@/components/brand/logo";

export const alt = "DuskUI — Animated React components built on shadcn/ui and Motion";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          backgroundColor: "#020604",
          backgroundImage:
            "radial-gradient(circle at 80% 20%, rgba(52,230,160,0.25), transparent 50%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoDataUri} width={72} height={72} alt="" />
          <div style={{ fontSize: 40, fontWeight: 700 }}>DuskUI</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            Animated React components
          </div>
          <div style={{ fontSize: 34, color: "rgba(255,255,255,0.6)" }}>
            shadcn/ui primitives, upgraded with Motion.
          </div>
        </div>
      </div>
    ),
    size
  );
}
