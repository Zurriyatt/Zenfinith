"use client";
import React, { useState } from "react";
import { useProducts } from "@/components/ProductsProvider";
import Image from "next/image";
import { Heart, ArrowLeft, Trash2, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import ProductCard from "@/components/collections/ProductCard";
export default function WishlistPage() {
  const products = useProducts() ?? [];
  const wishlistProducts = products.filter((p) => p.isLiked);

  // Empty state
  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-textPrimary">
        <div className="w-24 h-24 rounded-full bg-bgSecondary border border-border flex items-center justify-center mb-6">
          <Heart className="w-10 h-10 text-textPrimary/30" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
        <p className="text-textPrimary/50 mb-6">Save items you love for later.</p>
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-active text-white font-semibold hover:bg-active/90 transition-all active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" />
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-1">
          <Link
            href="/collections"
            className="group inline-flex items-center gap-1 text-sm text-textPrimary/50 hover:text-active transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Shopping
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-textPrimary">
            Your Wishlist
          </h1>
          <p className="text-sm text-textPrimary/50">
            {wishlistProducts.length} saved item{wishlistProducts.length !== 1 && "s"}
          </p>
        </div>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {wishlistProducts.map((product,idx) => (
          <ProductCard 
          key = {idx}
          product = {product}
          />
        ))}
      </div>
    </div>
  );
}