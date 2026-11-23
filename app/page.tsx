import type { Metadata } from "next";

import { HomeView } from "@/components/home/home-view";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HomeView />;
}
