"use client";

import * as React from "react";
import { motion, useReducedMotion, useTransform } from "motion/react";

import { Carousel, CarouselItem, useCarouselSlide, type CarouselItemProps, type CarouselProps } from "@/components/dusk/carousel/carousel";
import { cn } from "@/lib/utils";

const CoverflowContext = React.createContext({ rotate: 42, depth: 140, overlap: 0.18 });

export interface CoverflowCarouselProps extends Omit<CarouselProps, "align"> {
  /** Max tilt of the side slides, in degrees. */
  rotate?: number;
  /** How far side slides recede, in px. */
  depth?: number;
  /** How much side slides tuck in behind the selected one (0–0.5 of a slide). */
  overlap?: number;
}

/**
 * A 3D coverflow carousel: the selected slide faces you while its neighbours
 * tilt away, recede and dim. Every frame is driven by the track's motion value,
 * so it follows your finger while dragging and never re-renders React.
 *
 * Same parts as Carousel — swap CarouselItem for CoverflowItem and give slides
 * a width smaller than the viewport (e.g. `basis-1/2`). Loops by default.
 * Under reduced motion the tilt is halved and slides move without animation.
 */
export function CoverflowCarousel({
  rotate = 42,
  depth = 140,
  overlap = 0.18,
  loop = true,
  className,
  ...props
}: CoverflowCarouselProps) {
  const reduceMotion = useReducedMotion();
  const value = React.useMemo(
    () => ({ rotate: reduceMotion ? rotate / 2 : rotate, depth, overlap }),
    [reduceMotion, rotate, depth, overlap]
  );
  return (
    <CoverflowContext.Provider value={value}>
      <Carousel
        align="center"
        loop={loop}
        className={cn(
          "[&_[data-slot=carousel-viewport]]:[perspective:1200px]",
          "[&_[data-slot=carousel-content]]:[transform-style:preserve-3d]",
          className
        )}
        {...props}
      />
    </CoverflowContext.Provider>
  );
}

/** A coverflow slide. Put your card or image inside; it gets the 3D transform. */
export function CoverflowItem({ className, children, ...props }: CarouselItemProps) {
  return (
    <CarouselItem className={cn("basis-1/2 [transform-style:preserve-3d]", className)} {...props}>
      <CoverflowFace>{children}</CoverflowFace>
    </CarouselItem>
  );
}

function CoverflowFace({ children }: { children: React.ReactNode }) {
  const { progress } = useCarouselSlide();
  const { rotate, depth, overlap } = React.useContext(CoverflowContext);

  const clamped = useTransform(progress, (p) => Math.max(-2, Math.min(2, p)));
  const rotateY = useTransform(clamped, (p) => Math.max(-1, Math.min(1, p)) * -rotate);
  const z = useTransform(clamped, (p) => -Math.abs(p) * depth);
  // Pull side slides toward the centre so they tuck in behind the selected one.
  const x = useTransform(clamped, (p) => `${-p * overlap * 100}%`);
  const opacity = useTransform(clamped, (p) => 1 - Math.min(Math.abs(p), 2) * 0.28);
  const brightness = useTransform(clamped, (p) => `brightness(${1 - Math.min(Math.abs(p), 1) * 0.45})`);

  return (
    <motion.div
      className="relative h-full origin-center will-change-transform"
      style={{ rotateY, z, x, opacity, filter: brightness }}
    >
      {children}
    </motion.div>
  );
}
