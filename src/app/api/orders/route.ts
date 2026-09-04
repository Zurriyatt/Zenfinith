import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { SessionVerify } from "@/app/api/user/verify/route";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface OrderItemInput {
  productId: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const session = await SessionVerify();
    if (!session.success || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, couponCode, address, city, phone, country } = await req.json() as {
      items: OrderItemInput[];
      couponCode?: string | null;
      address: string;
      city: string;
      phone: string;
      country?: string;
    };

    if (!items || items.length === 0 || !address || !city || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch real product data
    const productIds = items.map((item) => item.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // Build enriched items with snapshot data
    const enrichedItems = items.map((item) => {
      const product = dbProducts.find((p) => p.id === item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }
      return {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || null,
        quantity: item.quantity,
      };
    });

    // Calculate subtotal
    const subtotal = enrichedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Validate coupon
    let discount = 0;
    let appliedCouponCode: string | null = null;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
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
          coupon.productIds.includes(item.productId)
      );
      if (applicableItems.length === 0) {
        return NextResponse.json({ error: "Coupon not applicable" }, { status: 400 });
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

    const total = Math.max(0, subtotal - discount);

    // Create Order with PENDING status
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        email: session.user.email || "",
        status: "PENDING",
        subtotal,
        discount,
        total,
        couponCode: appliedCouponCode,
        address,
        city,
        phone,
        country: country || "",
        items: {
          create: enrichedItems.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        },
      },
    });

    // Create Stripe Checkout Session
    const rate = subtotal > 0 ? total / subtotal : 0;
    const lineItems = enrichedItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * rate * 100),
      },
      quantity: item.quantity,
    }));

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
      client_reference_id: session.user.id,
      metadata: {
        orderId: order.id,
        couponCode: appliedCouponCode || "",
        discount: discount.toString(),
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}