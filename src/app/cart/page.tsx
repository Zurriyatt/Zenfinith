"use client";
import React, { useState } from "react";
import { useProducts } from "@/components/ProductsProvider";
import Image from "next/image";
import { Trash2, ShoppingBag, ArrowLeft, Minus, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";

export default function CartPage() {
  const router = useRouter();
  const products = useProducts() ?? [];
  const cartProducts = products.filter((p) => p.isInCart);
  const [clearing, setClearing] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const totalItems = cartProducts.reduce((sum, p) => sum + (p.qtyInCart || 0), 0);
  const totalPrice = cartProducts.reduce((sum, p) => sum + p.price * (p.qtyInCart || 0), 0);

  const handleClearCart = async () => {
    if (clearing) return;
    if (!confirm("Are you sure you want to clear your entire cart?")) return;

    setClearing(true);
    try {
      const res = await fetch("/api/user/product/cart", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Cart Cleared!");
        setTimeout(() => {
          window.location.reload()
        }, 1000)
        window.location.reload();
      } else {
        toast.error(data.error || "Failed to clear cart");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setClearing(false);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    if (removingId) return;
    setRemovingId(productId);
    try {
      const res = await fetch(`/api/user/product/clearCart/${productId}`, { method: "PUT", body: JSON.stringify({ quantity: 0 }) });
      const data = await res.json();
      if (data.success) {
        toast.success("Item removed from cart");
        window.location.reload();
      } else {
        toast.error(data.error || "Failed to remove item");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setRemovingId(null);
    }
  };

  const handleQuantityChange = async (productId: string, newQty: number) => {
    if (newQty < 1) return;
    if (updatingId) return;
    setUpdatingId(productId);
    try {
      // Optimistic update would be better, but for now refetch
      const res = await fetch(`/api/user/product/clearCart/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Product Quantity Changed!");
        setTimeout(() => {
          window.location.reload()
        }, 1000)
        window.location.reload();
      } else {
        toast.error(data.error || "Failed to update quantity");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setUpdatingId(null);
    }
  };

  // Empty state
  if (cartProducts.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-textPrimary">
        <div className="w-24 h-24 rounded-full bg-bgSecondary border border-border flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-textPrimary/30" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-textPrimary/50 mb-6">Looks like you haven't added anything yet.</p>
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-active text-white font-semibold hover:bg-active/90 transition-all active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-5">
        <div className="flex flex-col gap-1">
          <Link
            href="/collections"
            className="group inline-flex items-center gap-1 text-sm text-textPrimary/50 hover:text-active transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Shopping
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-textPrimary">
            Shopping Cart
          </h1>
          <p className="text-sm text-textPrimary/50">
            {totalItems} item{totalItems !== 1 && "s"} in your cart
          </p>
        </div>
        <button
          onClick={handleClearCart}
          disabled={clearing}
          className="px-4 py-2 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 hover:border-red-500/50 transition-all text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {clearing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Clear Cart
        </button>
      </div>

      {/* Cart Items */}
      <div className="space-y-4">
        {cartProducts.map((product) => (
          <div
            key={product.id}
            className="flex flex-col sm:flex-row gap-4 bg-bgSecondary border border-border rounded-2xl p-4 hover:shadow-lg transition-shadow duration-300"
          >
            {/* Product Image */}
            <Link href={`/products/${product.id}`} className="relative w-full sm:w-32 h-32 sm:h-32 rounded-xl overflow-hidden shrink-0">
              <Image
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </Link>

            {/* Product Info */}
            <div className="grow flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link
                    href={`/products/${product.id}`}
                    className="font-semibold text-textPrimary hover:text-active transition-colors"
                  >
                    {product.name}
                  </Link>
                  <p className="text-sm text-textPrimary/50 line-clamp-2 mt-1">
                    {product.description}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveItem(product.id)}
                  disabled={removingId === product.id}
                  className="p-2 rounded-lg text-textPrimary/40 hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0"
                  aria-label="Remove from cart"
                >
                  {removingId === product.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="flex items-end justify-between mt-auto pt-4">
                <div className="flex items-center border border-border rounded-xl">
                  <button
                    onClick={() => handleQuantityChange(product.id, (product.qtyInCart || 1) - 1)}
                    disabled={updatingId === product.id || (product.qtyInCart || 1) <= 1}
                    className="p-2 hover:bg-bgPrimary/10 transition-colors disabled:opacity-50"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-semibold text-sm">
                    {updatingId === product.id ? (
                      <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                    ) : (
                      product.qtyInCart || 1
                    )}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(product.id, (product.qtyInCart || 1) + 1)}
                    disabled={updatingId === product.id}
                    className="p-2 hover:bg-bgPrimary/10 transition-colors disabled:opacity-50"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-textPrimary">
                    ${(product.price * (product.qtyInCart || 1)).toFixed(2)}
                  </p>
                  {product.oldPrice && (
                    <p className="text-xs text-textPrimary/40 line-through">
                      ${(product.oldPrice * (product.qtyInCart || 1)).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="mt-8 bg-bgSecondary border border-border rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-textPrimary mb-4">Order Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-textPrimary/70">
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-textPrimary/70">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between font-semibold text-textPrimary text-lg">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick  = {() => { 
            router.replace("/checkout/?type=cart")
          }}
          className="mt-4 w-full py-3 rounded-xl bg-active text-white font-semibold hover:bg-active/90 transition-all active:scale-[0.98]"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}