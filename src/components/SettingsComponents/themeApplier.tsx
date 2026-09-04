// components/ThemeApplier.tsx
"use client";
import { useEffect } from "react";
import { useAppSelector } from "@/lib/redux/store";

export default function ThemeApplier() {
  const theme = useAppSelector((state) => state.settings?.appearance?.theme);
  const reduceMotion = useAppSelector((state) => state.settings?.appearance?.reduceMotion);
  useEffect(() => {
    const root = document.documentElement;
    if (!theme) return;;
    // Remove any existing theme classes (light / dark / system – you can adjust)
    root.classList.remove("light", "dark");
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.add(theme);
    }
    root.classList.remove("reduced-motion");
    if(reduceMotion){
      root.classList.add("reduced-motion")
    }else {
      root.classList.remove("reduced-motion")
    }
  }, [theme, reduceMotion]);

  return null; // no visible UI
}