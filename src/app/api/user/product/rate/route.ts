import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { SessionVerify } from "@/app/api/user/verify/route";

export async function POST(req: NextRequest) {
  try {
    const session = await SessionVerify();
    if (!session.user.id || !session.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, rating } = await req.json();
    if (!productId || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }

    // Fetch current product data
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { rating: true, reviewsCount: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Calculate new average (weighted for accuracy)
    const oldRating = product.rating || 0;
    const oldCount = product.reviewsCount || 0;
    const newCount = oldCount + 1;
    const newAverage = (oldRating * oldCount + rating) / newCount;
    const roundedAverage = Math.round(newAverage * 2) / 2; // round to nearest 0.5

    // Update product
    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: roundedAverage,
        reviewsCount: newCount,
      },
    });

    return NextResponse.json({ success: true, newRating: roundedAverage, reviewsCount: newCount });
  } catch (error) {
    console.error("Rating submission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}