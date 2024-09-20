import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
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
  authors: [{ name: "DuskUI Team" }],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative max-w-7xl mx-auto`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
