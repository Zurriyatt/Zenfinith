"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import AboutUs from "@/components/Home/About";
import CategoryShowcase from "@/components/Home/ProductShowCase";
import Link from "next/link";
export default function Home() {
  return (
    <>
      <section
        className="relative rounded-2xl overflow-hidden bg-linear-to-br from-bgPrimary to-bgSecondary border border-border h-[78vh]
max-h-190 
min-h-155
 w-[97vw] flex items-center"
      >
        {/* ✅ Background Image - Full bleed with overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/hero-entry.png"
            alt="Hero background with products"
            fill
            className="object-cover object-left drop-shadow-2xl"
            priority
          />
          {/* ✅ Dark overlay for text readability */}
          <div className="absolute inset-0 from-black/5 via-transparent to-white/15" />
        </div>

        {/* ✅ Content - Right aligned with padding */}
        <div
          className="relative z-20 w-sm mr-15 max-w-xxl px-6 md:px-12 ml-auto  text-left bg-bgSecondary/10 to bg-Secondary/15
backdrop-blur-md
border-white/20
border

rounded-3xl
p-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-textPrimary text-sm font-medium mb-4">
              ✦ New Collection
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-textPrimary"
          >
            Discover Everything
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-textPrimary/80 text-lg mt-4 max-w-lg "
          >
            Premium tech, fashion, and everyday essentials — curated for modern
            living.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link
              href={"/collections"}
              className="flex justify-center items-center ease-in"
            >
              <Button className="mt-6 bg-primary hover:bg-bgPrimary hover:text-textPrimary text-primary-foreground px-8 group cursor-pointer ease-in ">
                Explore Collection
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      <section className="w-[97vw] overflow-x-auto mt-24 ">
        <CategoryShowcase />
      </section>

      <AboutUs />

      <Footer />
    </>
  );
}
