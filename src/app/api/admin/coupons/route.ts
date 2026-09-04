import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { SessionVerify } from "@/app/api/user/verify/route";

export async function POST(req: NextRequest) {
  try {
    const session = await SessionVerify();
    if (!session.success || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      code,
      type,
      value,
      minOrderValue,
      maxDiscount,
      usageLimit,
      validUntil,
      productIds,
    } = body;

    if (!code || !type || !value) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.coupon.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code,
        type,
        value: parseFloat(value),
        minOrderValue: minOrderValue ? parseFloat(minOrderValue) : 0,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : 0,
        usageLimit: usageLimit ? parseInt(usageLimit) : 1,
        validUntil: validUntil ? new Date(validUntil) : null,
        productIds: productIds || [],
      },
    });

    return NextResponse.json({ success: true, coupon }, { status: 201 });
  } catch (error) {
    console.error("Coupon create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}