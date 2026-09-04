"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
  Tag,
  Loader2,
  MessageCircle,
  ShieldCheck,
  Lock,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { useProducts } from "@/components/ProductsProvider";
import { toast } from "sonner";

interface CheckoutItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const products = useProducts() ?? [];

  const checkoutType = searchParams.get("type") || "cart";
  const productId = searchParams.get("id");

  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Address state
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");

  // Build items based on type
  useEffect(() => {
    if (checkoutType === "product" && productId) {
      const product = products.find((p) => p.id === productId);
      if (product) {
        setItems([
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: 1,
          },
        ]);
      }
    } else if (checkoutType === "cart") {
      const cartItems = products
        .filter((p) => p.isInCart)
        .map((p) => ({
          productId: p.id,
          name: p.name,
          price: p.price,
          image: p.images[0],
          quantity: p.qtyInCart || 1,
        }));
      setItems(cartItems);
    }
  }, [checkoutType, productId, products]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
  const total = Math.max(0, subtotal - discount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode.trim(),
          cartItems: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });
      const data = await res.json();
      if (data.valid) {
        setDiscount(data.discount);
        setAppliedCoupon(couponCode.trim());
        toast.success(`Coupon applied! You saved $${data.discount.toFixed(2)}`);
      } else {
        toast.error(data.error || "Invalid coupon");
      }
    } catch {
      toast.error("Failed to validate coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    if (!address.trim() || !city.trim() || !phone.trim()) {
      toast.error("Please fill in your shipping details");
      return;
    }

    setCheckoutLoading(true);
    try {
      // 1. Create pending order and get Stripe URL
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          couponCode: appliedCoupon,
          address,
          city,
          phone,
          country,
        }),
      });

      const data = await res.json();
      if (data.url) {
        // 2. Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Failed to create order");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (items.length === 0 && products.length > 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-textPrimary">
        <ShoppingBag className="w-16 h-16 text-textPrimary/30 mb-4" />
        <p className="text-2xl font-semibold mb-2">No items to checkout</p>
        <Link href="/collections" className="text-active hover:underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        href={checkoutType === "cart" ? "/cart" : `/product/${productId}`}
        className="inline-flex items-center gap-1 text-sm text-textPrimary/50 hover:text-active transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold text-textPrimary mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Items + Address */}
        <div className="lg:col-span-2 space-y-8">
          {/* Items */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 bg-bgSecondary border border-border rounded-2xl p-4"
              >
                <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="grow">
                  <p className="font-semibold text-textPrimary">{item.name}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-textPrimary/60">
                      Qty: {item.quantity}
                    </span>
                    <span className="font-bold text-textPrimary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          <div className="bg-bgSecondary border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-textPrimary">
              Shipping Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-textPrimary/70 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, House, Building"
                  className="p-2.5 rounded-xl border border-border bg-bgPrimary/5 text-textPrimary focus:border-active focus:ring-4 focus:ring-active/10 transition-all"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-textPrimary/70">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="p-2.5 rounded-xl border border-border bg-bgPrimary/5 text-textPrimary focus:border-active focus:ring-4 focus:ring-active/10 transition-all"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-textPrimary/70 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 0000000"
                  className="p-2.5 rounded-xl border border-border bg-bgPrimary/5 text-textPrimary focus:border-active focus:ring-4 focus:ring-active/10 transition-all"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-textPrimary/70">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Pakistan"
                  className="p-2.5 rounded-xl border border-border bg-bgPrimary/5 text-textPrimary focus:border-active focus:ring-4 focus:ring-active/10 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Summary + Coupon + Payment */}
        <div className="lg:col-span-1">
          <div className="bg-bgSecondary border border-border rounded-2xl p-6 space-y-6 sticky top-24">
            <h2 className="text-xl font-semibold text-textPrimary">
              Order Summary
            </h2>

            {/* Coupon */}
            <div>
              <label className="text-sm font-medium text-textPrimary/70 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Discount Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 p-2 rounded-xl border border-border bg-bgPrimary/5 text-textPrimary focus:border-active focus:ring-4 focus:ring-active/10 transition-all"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponLoading}
                  className="px-4 py-2 rounded-xl bg-active text-white font-semibold hover:bg-active/90 transition-colors disabled:opacity-50"
                >
                  {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                </button>
              </div>
              {appliedCoupon && (
                <p className="text-xs text-green-600 mt-1">
                  Coupon {appliedCoupon} applied
                </p>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-textPrimary/70">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-textPrimary/70">
                <span>Shipping</span>
                <span>Calculated at next step</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-bold text-lg text-textPrimary">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={checkoutLoading}
              className="w-full py-3 rounded-xl bg-active text-white font-semibold hover:bg-active/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {checkoutLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Proceed to Payment
                </>
              )}
            </button>

            <div className="flex items-center gap-2 text-xs text-textPrimary/40">
              <ShieldCheck className="w-4 h-4" />
              Secure checkout powered by Stripe
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Support */}
      <a
        href={`https://wa.me/923296623549?text=Hello%2C%20I%20need%20help%20with%20my%20order`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm font-medium">Need Help?</span>
      </a>
    </div>
  );
}