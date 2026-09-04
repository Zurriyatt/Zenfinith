import Image from "next/image";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import type { Product } from "@/lib/products";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/store";
import { useCurrency } from "../SettingsComponents/currencyContext";
export default function ProductCard({ product }: { product: Product }) {
    const router = useRouter();
    const { exchangeRates } = useCurrency();
    const currentCurrency = useAppSelector((state) => state.settings.appearance.currency) || "USD";
    const symbols: Record<string, string> = {
        USD: "$",
        EUR: "€",
        PKR: "₨",
    };

    const currencySymbol = symbols[currentCurrency] || "$";
    const price = exchangeRates[currentCurrency] * product.price;
   console.log("Currency:", currentCurrency, "Rate:", exchangeRates[currentCurrency], "Price:", product.price);
    return (
        <div
            onClick={() => {
                router.replace(`/products/${product.id}`);
            }}
            className="group relative bg-bgSecondary rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 snap-start"
        >
            {/* Image */}
            <div className="relative aspect-5/5 overflow-hidden">
                <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                {product.badge && (
                    <span className="absolute top-3 left-3 bg-active text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
                        {product.badge}
                    </span>
                )}
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className="text-sm font-medium text-textPrimary truncate">{product.name}</h3>
                <div className="flex items-center gap-2 mt-1 ">
                    <span className="font-semibold text-textPrimary">{currencySymbol}{price.toFixed(2)}</span>
                    {product.totalDiscount > 0 && (
                        <>
                            <span className="text-sm text-textPrimary/50 line-through overflow-hidden text-ellipsis">
                                {currencySymbol}{(price / (1 - product.totalDiscount / 100)).toFixed(2)}
                            </span>
                            <span className="text-xs font-medium text-active  ">-{product.totalDiscount}%</span>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs text-textPrimary/60 justify-between">
                    <div className="flex justify-center items-center">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 " />
                        <span className="text-sm pl-0.5">{product.rating}</span>
                    </div>
                    <span></span>
                </div>
            </div>
        </div>
    );
}
