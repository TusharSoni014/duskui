import { ImageResponse } from "next/og";

import { logoDataUri } from "@/components/brand/logo";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#121212",
          backgroundImage: "radial-gradient(circle at 50% 35%, rgba(52,230,160,0.22), transparent 65%)",
        }}
      >
        { }
        <img src={logoDataUri} width={120} height={120} alt="" />
      </div>
    ),
    size
  );
}
