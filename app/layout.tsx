import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "DuskUI - Animated React Component Library",
  description:
    "Open-source UI component library for Next.js and React with animated and customizable components.",
  keywords: [
    "React",
    "Next.js",
    "UI library",
    "components",
    "animated",
    "customizable",
    "open-source",
  ],
  authors: [{ name: "Tushar Verma" }],
  openGraph: {
    title: "DuskUI - Animated React Component Library",
    description:
      "Open-source UI component library for Next.js and React with animated and customizable components.",
    type: "website",
    url: "https://duskui.com",
    images: [
      {
        url: "https://duskui.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "DuskUI - Animated React Component Library",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DuskUI - Animated React Component Library",
    description:
      "Open-source UI component library for Next.js and React with animated and customizable components.",
    images: ["https://duskui.com/twitter-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
