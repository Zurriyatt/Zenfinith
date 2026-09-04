import { NextRequest,NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
interface Product {
  productId: string;
  quantity: number;
  price: number;
}
export async function POST(req:NextRequest){ 

const { code, cartItems } = await req.json();
// cartItems: [{ productId, quantity, price }]

const coupon = await prisma.coupon.findUnique({ where: { code } });

if (!coupon || !coupon.isActive) {
  return NextResponse.json({ valid: false, error: "Invalid coupon" });
}

if (coupon.validUntil && new Date() > coupon.validUntil) {
  return NextResponse.json({ valid: false, error: "Coupon expired" });
}

if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
  return NextResponse.json({ valid: false, error: "Coupon limit reached" });
}

// Check if applies to cart items
const applicableItems = cartItems.filter((item:Product) =>
  coupon.productIds.length === 0 || coupon.productIds.includes(item.productId)
);

if (applicableItems.length === 0) {
  return NextResponse.json({ valid: false, error: "Coupon not applicable" });
}

// Calculate discount
let subtotal = applicableItems.reduce((sum:number, item:Product) => sum + item.price * item.quantity, 0);
let discount = coupon.type === "PERCENTAGE" ? (subtotal * coupon.value) / 100 : coupon.value;

if (coupon.maxDiscount && discount > coupon.maxDiscount) {
  discount = coupon.maxDiscount;
}

return NextResponse.json({
  valid: true,
  discount,
  couponId: coupon.id,
});

}