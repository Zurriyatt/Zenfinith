"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Zap, Shield, Globe, Sparkles } from "lucide-react";

const stats = [
  {
    icon: Zap,
    label: "Hybrid Engine",
    description: "Node + Django for ultimate performance",
  },
  {
    icon: Shield,
    label: "Secure by Design",
    description: "ACID compliance & HMAC-SHA256 JWT",
  },
  {
    icon: Globe,
    label: "Scalable",
    description: "Serverless-first, scale-to-zero architecture",
  },
  {
    icon: Sparkles,
    label: "AI-Powered",
    description: "Smart recommendations & personalization",
  },
];

export default function AboutUs() {
  return (
    <section className="w-[97vw] py-16 md:py-20 rounded-2xl bg-linear-to-br from-bgPrimary to-bgSecondary border border-border overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        {/* Badge */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
        >
          ✦ About Zenfinith
        </motion.span>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-textPrimary leading-tight"
        >
          Built by a <span className="text-primary">17-year-old</span>{" "}
          <br className="hidden sm:block" />
          for the future of commerce
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-textSecondary text-lg mt-4 max-w-2xl mx-auto"
        >
          Zenfinith is a hybrid, polyglot e-commerce engine designed to be 
          scalable, fast, secure, and cost-efficient. Every line of code 
          is crafted with passion and precision.
        </motion.p>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center p-4 rounded-xl bg-bgSecondary/50 border border-border/50 backdrop-blur-sm"
            >
              <stat.icon className="h-8 w-8 text-primary mb-2" />
              <h4 className="text-sm font-semibold text-textPrimary">
                {stat.label}
              </h4>
              <p className="text-xs text-textSecondary/70 mt-1">
                {stat.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}