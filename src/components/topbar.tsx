"use client";

import { useState, useEffect } from "react";
import { X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from 'react';

interface TopBarProps {
  message?: string;
  linkText?: string;
  linkHref?: string;
  className?: string;
  isVisible?:boolean;
  setIsVisible?:Dispatch<SetStateAction<boolean>>
}

export default function TopBar({
  message = "🚀 Free shipping on orders over $50 — Use code: ZENFREESHIP",
  linkText = "Shop Now",
  linkHref = "/shop",
  className,
  isVisible,
  setIsVisible,

}: TopBarProps) {
  

  const handleDismiss = () => {
    if (setIsVisible) {
      setIsVisible(false);
    }
  };
  

  return (
    <div
      className={cn(
        `z-50 w-full bg-primary text-primary-foreground px-4 py-2.5 text-center text-[10px] font-medium",
        "border-b border-primary-foreground/10 transition-all duration-250 ease-in `,
        className,
        isVisible ?" top-0 ":"top-[calc(-55px)]"
      )}
    >
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span>{message}</span>
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Dismiss announcement"
        >
          <X className="h-4 w-4 hover:cursor-pointer" />
        </button>
      </div>
    </div>
  );
}