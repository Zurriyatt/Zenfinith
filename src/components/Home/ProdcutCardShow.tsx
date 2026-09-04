"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShowcaseCardProps {
  title: string;
  subtitle?: string;
  href: string;
  images: string[];
  ctaText?: string;
  className?: string;
}

export function ShowcaseCard({
  title,
  subtitle,
  href,
  images,
  ctaText = "Explore →",
  className,
}: ShowcaseCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div
      className={cn(
        "group relative rounded-2xl overflow-hidden",
        "bg-bgSecondary border border-border",
        "hover:shadow-xl hover:border-primary/20",
        "transition-all duration-300 ease-in-out",
        "flex flex-col",
        "h-[clamp(400px,28vw,800px)] w-80 md:w-[23vw]",
        className
      )}
    >
      {/* ✅ Image Slider */}
      <div className="relative aspect-[3/3] md:aspect-[2.5/3] overflow-hidden bg-bgPrimary">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0"
          >
            <Image
              src={images[currentIndex]}
              alt={`${title} - Image ${currentIndex + 1}`}
              fill
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* ✅ Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2",
                "p-1.5 rounded-full",
                "bg-bgPrimary/50 backdrop-blur-sm",
                "text-textPrimary hover:bg-bgPrimary/70",
                "transition-all duration-200",
                "opacity-[0.3] group-hover:opacity-100",
                "hover:scale-110 hover:cursor-pointer"
              )}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextSlide}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2",
                "p-1.5 rounded-full",
                "bg-bgPrimary/50 backdrop-blur-sm",
                "text-textPrimary hover:bg-bgPrimary/70",
                "transition-all duration-200",
                "opacity-[0.3] group-hover:opacity-100 group-active:opacity-100",
                "hover:scale-110 hover:cursor-pointer"
              )}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* ✅ Dot Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                  index === currentIndex
                    ? "bg-white w-4"
                    : "bg-white/50 hover:bg-white/80"
                )}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ✅ Content */}
      <div className="p-4 md:p-5 flex-1 flex flex-col">
        <h3 className="text-lg md:text-xl font-bold text-textPrimary">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-textSecondary mt-0.5">{subtitle}</p>
        )}
        <a
          href={href}
          className={cn(
            "mt-3 text-sm font-medium",
            "text-primary hover:text-primary/80",
            "inline-flex items-center gap-1",
            "transition-all duration-200",
            "group-hover:gap-2 hover:cursor-pointer"
          )}
        >
          {ctaText}
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
}