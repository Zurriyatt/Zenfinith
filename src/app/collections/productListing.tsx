"use client";

import { useState, useMemo } from "react";
import { useProducts } from "@/components/ProductsProvider";
import ProductCard from "@/components/collections/ProductCard";
import { Search, SlidersHorizontal, X, Star, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/components/SettingsComponents/currencyContext";
import { useAppSelector } from "@/lib/redux/store";

interface ProductListingProps {
    category?: string;
    title: string;
    description?: string;
    saleOnly?: boolean;
}

export default function ProductListing({ category, title, description, saleOnly = false }: ProductListingProps) {
    // inside component:
    const { exchangeRates } = useCurrency();
    const currentCurrency = useAppSelector((state) => state.settings.appearance.currency) || "USD";
    const effectiveCurrency = currentCurrency === "system" ? "USD" : currentCurrency;
    const rate = exchangeRates[effectiveCurrency] || 1; // 1 USD = rate units of selected currenc
    const allProducts = useProducts() ?? [];
    // State for filters and sorting
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("featured");
    const [minPrice, setMinPrice] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<string>("");
    const [minRating, setMinRating] = useState<string>("0");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filter products based on category and saleOnly
    const categoryFiltered = useMemo(() => {
        if (saleOnly) {
            return allProducts.filter((p) => p.price * (p.totalDiscount / 100) < p.price);
        }
        if (!category || category === "shop-all") return allProducts;
        return allProducts.filter((p) => p.category === category);
    }, [allProducts, category, saleOnly]);

    // Apply search, price range, rating
    const filteredProducts = useMemo(() => {
        let result = categoryFiltered;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                (p) => p.name.toLowerCase().includes(term) || p.description?.toLowerCase().includes(term),
            );
        }

        if (minPrice !== "") {
            const min = parseFloat(minPrice);
            if (!isNaN(min)) result = result.filter((p) => p.price*rate >= min);
        }

        if (maxPrice !== "") {
            const max = parseFloat(maxPrice);
            if (!isNaN(max)) result = result.filter((p) => p.price*rate <= max);
        }

        if (minRating && minRating !== "0") {
            const min = parseFloat(minRating);
            result = result.filter((p) => (p.rating ?? 0) >= min);
        }

        return result;
    }, [categoryFiltered, searchTerm, minPrice, maxPrice, minRating]);

    // Sort products
    const sortedProducts = useMemo(() => {
        const sorted = [...filteredProducts];
        switch (sortBy) {
            case "price-asc":
                sorted.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                sorted.sort((a, b) => b.price - a.price);
                break;
            case "rating":
                sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
                break;
            case "newest":
                // Since we don't have createdAt in our type, we can treat featured as default
                // But we can leave it; in real app you'd sort by date.
                break;
            case "featured":
            default:
                // Keep original order (could be based on relevance)
                break;
        }
        return sorted;
    }, [filteredProducts, sortBy]);

    const clearFilters = () => {
        setSearchTerm("");
        setMinPrice("");
        setMaxPrice("");
        setMinRating("0");
        setSortBy("featured");
    };

    const hasActiveFilters = searchTerm || minPrice || maxPrice || minRating !== "0";

    return (
        <div className="max-w-[95vw] mx-auto py-2">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-textPrimary">{title}</h1>
                    {description && <p className="text-lg text-textPrimary/60 mt-2">{description}</p>}
                </div>
                <p className="text-sm text-textPrimary/50 shrink-0">
                    {sortedProducts.length} product{sortedProducts.length !== 1 && "s"}
                </p>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                {/* Search */}
                <div className="relative flex-grow max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textPrimary/40" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search products..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-bgSecondary text-textPrimary placeholder:text-textPrimary/30 focus:border-active focus:ring-4 focus:ring-active/10 transition-all"
                    />
                </div>

                {/* Filter toggle */}
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-bgSecondary text-textPrimary/80 hover:text-textPrimary transition-colors",
                        isFilterOpen && "border-active text-active",
                    )}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-active" />}
                </button>

                {/* Sort */}
                <div className="flex items-center gap-2 ml-auto">
                    <ArrowUpDown className="w-4 h-4 text-textPrimary/40" />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="py-2 px-3 rounded-xl border border-border bg-bgSecondary text-textPrimary focus:border-active focus:ring-4 focus:ring-active/10 transition-all"
                    >
                        <option value="featured">Featured</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="rating">Rating</option>
                        <option value="newest">Newest</option>
                    </select>
                </div>
            </div>

            {/* Filter Panel */}
            {isFilterOpen && (
                <div className="bg-bgSecondary border border-border rounded-xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-textPrimary/60">Min Price</label>
                        <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="0"
                            className="py-2 px-3 rounded-lg border border-border bg-bgPrimary/5 text-textPrimary focus:border-active"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-textPrimary/60">Max Price</label>
                        <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="Any"
                            className="py-2 px-3 rounded-lg border border-border bg-bgPrimary/5 text-textPrimary focus:border-active"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-textPrimary/60">Minimum Rating</label>
                        <select
                            value={minRating}
                            onChange={(e) => setMinRating(e.target.value)}
                            className="py-2 px-3 rounded-lg border border-border bg-bgPrimary/5 text-textPrimary focus:border-active"
                        >
                            <option value="0">Any</option>
                            <option value="4">4+ Stars</option>
                            <option value="3">3+ Stars</option>
                            <option value="2">2+ Stars</option>
                            <option value="1">1+ Stars</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={clearFilters}
                            className="w-full py-2 px-3 rounded-lg border border-border text-textPrimary/70 hover:text-textPrimary hover:bg-bgPrimary/10 transition-colors flex items-center justify-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Clear
                        </button>
                    </div>
                </div>
            )}

            {/* Product Grid */}
            {sortedProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {sortedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center text-textPrimary/40">
                    <p className="text-lg">No products found</p>
                    <button
                        onClick={clearFilters}
                        className="mt-4 text-sm underline underline-offset-2 hover:text-textPrimary"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
}
