"use client";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import TopBar from "@/components/topbar";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react"
import { Session } from "next-auth";
import { ProductsProvider } from "@/components/ProductsProvider";
import { Product } from "@/lib/products";
import ProductSectionPreview from "@/components/collections/productSectionPreview";
import { CurrencyProvider } from "@/components/SettingsComponents/currencyContext";

interface VisibleLayoutProps {
  children: React.ReactNode;
  session: Session|null;
  initialProducts: Product[]
}

export default function VisibleLayout({
  children,
  session,
  initialProducts
}: VisibleLayoutProps): React.ReactNode {
  const [isVisible, setIsVisible] = useState(true);


  return (
    <SessionProvider session={session}>
    <div className={`flex flex-col items-center transition-all duration-250 ease-in ${isVisible === true ? "pt-10  md:pt-14" : " pt-6 md:pt-8"}  min-h-screen bg-bgPrimary text-textPrimary gap-4 p-2 `}>
            <Toaster position="top-right" />
      <TopBar className={`fixed left-0 right-0 `} isVisible={isVisible} setIsVisible={setIsVisible} />
      <CurrencyProvider>
       <ProductsProvider products={initialProducts}>
      <div
        className={`sticky top-9 z-40 transition-all duration-300 ease-in-out `}
      >
     
      <Navbar />
    
      </div>
      <main className="">
        {children}
        </main>
      </ProductsProvider>
      </CurrencyProvider>
    </div>
    </SessionProvider>
  );
}
