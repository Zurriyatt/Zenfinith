import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { SessionVerify } from "@/app/api/user/verify/route";

export async function POST(req: NextRequest) {
  try {
    const session = await SessionVerify();
    if (!session.success || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    // Use upsert to prevent duplicate likes
    const likedItem = await prisma.liked.upsert({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
      create: {
        userId: session.user.id,
        productId,
      },
      update: {}, // no updates needed; just ensure it exists
    });

    return NextResponse.json({ success: true, likedItem });
  } catch (error) {
    console.error("Add to liked error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}