"use client";

import AnimatedReveal from "@/components/ui/animated-reveal";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { IoIosContact } from "react-icons/io";
import { RiPuzzleFill } from "react-icons/ri";

export default function Home() {
  return (
    <div className="relative w-full h-fill flex justify-center items-center flex-col">
      <div className="flex justify-center items-center flex-col">
        <div className="text-6xl font-bold bg-gradient-to-t from-white/100 to-white/70 bg-clip-text text-transparent flex">
          <Image
            alt="DuskUI"
            src="https://pub-f215723903f74ba688c6a4a886cd3abb.r2.dev/duskui.svg"
            height={25}
            width={25}
            className="[filter:invert(100%)] object-contain h-full w-[45px]"
          />
          usk UI
        </div>
        <AnimatedReveal className="text-white/60">
          Open-source UI component library for Next.js and React with
          animations.
        </AnimatedReveal>
      </div>
      <div className="flex gap-3 mt-5">
        <Link href="/components">
          <Button className="flex justify-center items-center gap-1">
            <RiPuzzleFill />
            Browse Components
          </Button>
        </Link>
        <Link href="/contact">
          <Button
            className="flex justify-center items-center gap-1"
            variant="secondary"
          >
            <IoIosContact />
            Contact Me
          </Button>
        </Link>
      </div>
    </div>
  );
}
