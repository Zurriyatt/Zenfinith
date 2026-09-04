"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, ShoppingCart, ChevronLeft, Minus, Plus, Loader2, MessageCircle } from "lucide-react";
import { useProducts } from "@/components/ProductsProvider";
import { toast } from "sonner";
import Link from "next/link";
import { Product } from "@/lib/products";
import ProductCard from "@/components/collections/ProductCard";
import { Star } from "lucide-react";
export default function ProductPage() {
    const [rating, setRating] = useState(0);
    const [ratingLoading, setRatingLoading] = useState(false);

    const { id } = useParams() as { id: string };
    const router = useRouter(); // ✅ for Buy Now navigation
    const products = useProducts() ?? [];
    const product = products.find((p) => p.id === id);

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(product?.isLiked);
    const [cartLoading, setCartLoading] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    if (!product) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-textPrimary/50">
                <p className="text-2xl mb-4">Product not found</p>
                <Link href="/collections" className="text-active hover:underline">
                    ← Back to collections
                </Link>
            </div>
        );
    }
    const [recommendations, setRecommendations] = useState<Product[]>([]);

    useEffect(() => {
        fetch(`https://zenfinith-backend-63d28.containers.snapdeploy.app/api/products/recommendations/${product.id}/`)
            .then((res) => res.json()).catch(err=>{toast.error("Recommendations not available!")})
            .then((data) => {
                setRecommendations(data);
            })
            .catch((err) => console.error("Failed to fetch recommendations:", err));
    }, [product.id]);

    const discountPercent = product.oldPrice
        ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
        : product.totalDiscount || 0;

    const handleAddToCart = async () => {
        if (cartLoading) return;
        setCartLoading(true);

        try {
            const res = await fetch("/api/user/product/add-to-cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product.id, quantity }),
            });

            const data = await res.json();
            if (data.success) {
                toast.success(`${quantity} × ${product.name} added to cart!`);
                setTimeout(() => {
                    window.location.reload();
                }, 700);
            } else {
                toast.error(data.error || "Failed to add to cart");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setCartLoading(false);
        }
    };

    const handleToggleWishlist = async () => {
        if (wishlistLoading) return;
        setWishlistLoading(true);

        try {
            if (!isWishlisted) {
                const res = await fetch("/api/user/product/addToLiked", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productId: product.id }),
                });
                const data = await res.json();
                if (data.success) {
                    setIsWishlisted(true);
                    toast.success("Added to wishlist");
                    setTimeout(() => {
                        window.location.reload();
                    }, 700);
                } else {
                    toast.error(data.error || "Failed to add to wishlist");
                }
            } else {
                const res = await fetch(`/api/user/product/unLike/${product.id}`, {
                    method: "DELETE",
                });
                const data = await res.json();
                if (data.success) {
                    setIsWishlisted(false);
                    toast.success("Removed from wishlist");
                    setTimeout(() => {
                        window.location.reload();
                    }, 700);
                } else {
                    toast.error(data.error || "Failed to remove from wishlist");
                }
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setWishlistLoading(false);
        }
    };

    const handleBuyNow = () => {
        // Navigate to checkout with product id
        router.push(`/checkout/?id=${product.id}&type=product`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Breadcrumb / Back */}
            <Link
                href="/collections"
                className="inline-flex items-center gap-1 text-sm text-textPrimary/50 hover:text-active transition-colors mb-6"
            >
                <ChevronLeft className="w-4 h-4" />
                Back to collections
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* ─── Image Gallery ─── */}
                <div>
                    <div className="relative aspect-square rounded-2xl overflow-hidden border border-border bg-bgSecondary">
                        <Image
                            src={product.images[selectedImage] || product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                        {product.badge && (
                            <span className="absolute top-4 left-4 bg-active text-white text-xs font-semibold px-3 py-1 rounded-full">
                                {product.badge}
                            </span>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {product.images.length > 1 && (
                        <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                                        idx === selectedImage
                                            ? "border-active"
                                            : "border-transparent hover:border-border"
                                    }`}
                                >
                                    <Image
                                        src={img}
                                        alt={`${product.name} thumbnail ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ─── Product Info ─── */}
                <div className="flex flex-col">
                    <h1 className="text-3xl md:text-4xl font-bold text-textPrimary">{product.name}</h1>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                        i < Math.round(product.rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-textPrimary/20"
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-textPrimary/60">
                            {product.rating} · {product.reviewsCount} reviews
                        </span>
                    </div>

                    {/* Price */}
                    <div className="mt-4 flex items-end gap-3">
                        <span className="text-3xl font-bold text-textPrimary">${product.price.toFixed(2)}</span>
                        {product.oldPrice && (
                            <>
                                <span className="text-lg text-textPrimary/40 line-through">
                                    ${product.oldPrice.toFixed(2)}
                                </span>
                                <span className="text-sm font-medium text-green-600">Save {discountPercent}%</span>
                            </>
                        )}
                    </div>

                    {/* Description */}
                    <p className="mt-6 text-textPrimary/70 leading-relaxed">
                        {product.description || "No description available for this product."}
                    </p>

                    {/* Quantity Selector */}
                    <div className="mt-8 flex items-center gap-4">
                        <span className="text-sm font-medium text-textPrimary/80">Quantity</span>
                        <div className="flex items-center border border-border rounded-xl">
                            <button
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                className="p-2 hover:bg-bgSecondary transition-colors"
                                aria-label="Decrease quantity"
                                disabled={cartLoading}
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center font-semibold">{quantity}</span>
                            <button
                                onClick={() => setQuantity((q) => q + 1)}
                                className="p-2 hover:bg-bgSecondary transition-colors"
                                aria-label="Increase quantity"
                                disabled={cartLoading}
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleAddToCart}
                            disabled={cartLoading}
                            className="flex-1 py-3 rounded-xl bg-textPrimary text-bgPrimary font-semibold hover:bg-textPrimary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {cartLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <ShoppingCart className="w-4 h-4" />
                            )}
                            {cartLoading ? "Adding..." : "Add to Cart"}
                        </button>
                        <button
                            onClick={handleToggleWishlist}
                            disabled={wishlistLoading}
                            className="p-3 rounded-xl border border-border hover:bg-bgSecondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Toggle wishlist"
                        >
                            {wishlistLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Heart
                                    className={`w-5 h-5 ${
                                        isWishlisted ? "fill-red-500 text-red-500" : "text-textPrimary/60"
                                    }`}
                                />
                            )}
                        </button>
                    </div>

                    {/* Buy Now */}
                    <button
                        onClick={handleBuyNow}
                        className="mt-3 py-3 rounded-xl bg-active text-white font-semibold hover:bg-active/90 transition-all active:scale-[0.98]"
                    >
                        Buy It Now
                    </button>

                    {/* WhatsApp Support */}
                    <a
                        href="https://wa.me/923296623549?text=Hello%2C%20I%27m%20interested%20in%20this%20product%3A%20%5BProduct%5D"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex items-center justify-center gap-2 py-3 rounded-xl border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/10 hover:border-[#25D366]/50 transition-all text-sm font-medium"
                    >
                        <MessageCircle className="w-4 h-4" />
                        Buy via WhatsApp
                    </a>
                    <div className="mt-6 border-t border-border pt-4">
                        <h5 className="text-sm font-medium text-textPrimary/70 mb-2">Rate this product</h5>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={async () => {
                                        if (ratingLoading) return;
                                        setRating(star);
                                        setRatingLoading(true);
                                        try {
                                            const res = await fetch("/api/user/product/rate", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ productId: product.id, rating: star }),
                                            });
                                            const data = await res.json();
                                            if (data.success) {
                                                toast.success(`Thanks! You rated ${star} star${star > 1 ? "s" : ""}`);
                                                // Reload to see updated rating
                                                setTimeout(() => {
                                                    window.location.reload();
                                                }, 700);
                                            } else {
                                                toast.error(data.error || "Failed to submit rating");
                                            }
                                        } catch {
                                            toast.error("An error occurred");
                                        } finally {
                                            setRatingLoading(false);
                                        }
                                    }}
                                    disabled={ratingLoading}
                                    className="transition-transform hover:scale-110 disabled:opacity-50"
                                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                                >
                                    <Star
                                        className={`w-6 h-6 ${
                                            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-textPrimary/20"
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Additional info */}
                    <div className="mt-8 border-t border-border pt-6 text-sm text-textPrimary/50 space-y-2">
                        <p>✓ Free shipping on orders over $50</p>
                        <p>✓ 30-day easy returns</p>
                        <p>✓ Secure checkout</p>
                    </div>
                </div>
            </div>
            {recommendations?.length > 0 && (
                <section className="mt-12">
                    <h2 className="text-2xl font-semibold mb-4">You Might Also Like</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {recommendations.map((rec) => (
                            <ProductCard key={rec.id} product={rec} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
