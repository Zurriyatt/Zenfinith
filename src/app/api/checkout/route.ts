import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { SessionVerify } from "@/app/api/user/verify/route";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CheckoutItemInput {
  id: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const session = await SessionVerify();
    if (!session.success || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, couponCode } = await req.json() as {
      items: CheckoutItemInput[];
      couponCode?: string | null;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    // 1. Fetch actual product prices from DB
    const productIds = items.map((item) => item.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const priceMap = new Map(dbProducts.map((p) => [p.id, p.price]));
    const enrichedItems = items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: priceMap.get(item.id) ?? 0,
      name: dbProducts.find((p) => p.id === item.id)?.name || "Product",
    }));

    // 2. Calculate subtotal
    const subtotal = enrichedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // 3. Validate and compute discount
    let discount = 0;
    let appliedCouponCode: string | null = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode },
      });

      if (!coupon || !coupon.isActive) {
        return NextResponse.json({ error: "Invalid coupon" }, { status: 400 });
      }
      if (coupon.validUntil && new Date() > coupon.validUntil) {
        return NextResponse.json({ error: "Coupon expired" }, { status: 400 });
      }
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return NextResponse.json({ error: "Coupon limit reached" }, { status: 400 });
      }

      const applicableItems = enrichedItems.filter(
        (item) =>
          coupon.productIds.length === 0 ||
          coupon.productIds.includes(item.id)
      );

      if (applicableItems.length === 0) {
        return NextResponse.json(
          { error: "Coupon not applicable to these items" },
          { status: 400 }
        );
      }

      const applicableSubtotal = applicableItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      discount =
        coupon.type === "PERCENTAGE"
          ? (applicableSubtotal * coupon.value) / 100
          : Math.min(coupon.value, applicableSubtotal);

      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }

      appliedCouponCode = coupon.code;
    }

    const finalTotal = Math.max(0, subtotal - discount);

    // 4. Create Stripe line items with discount applied proportionally
    const rate = subtotal > 0 ? finalTotal / subtotal : 0;

    const lineItems = enrichedItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * rate * 100), // cents
      },
      quantity: item.quantity,
    }));

    // 5. Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
      client_reference_id: session.user.id,
      metadata: {
        couponCode: appliedCouponCode || "",
        discount: discount.toString(),
        subtotal: subtotal.toString(),
        finalTotal: finalTotal.toString(),
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}