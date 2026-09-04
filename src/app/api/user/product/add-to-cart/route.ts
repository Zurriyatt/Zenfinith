import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { SessionVerify } from "@/app/api/user/verify/route";

export async function POST(req: NextRequest) {
  try {
    console.log("reached")
    const session = await SessionVerify();
    if (!session.success || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity = 1 } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    // Upsert: if product already in cart, increment quantity; otherwise create
  
    const cartItem = await prisma.cart.upsert({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
      create: {
        userId: session.user.id,
        productId,
        quantity,
      },
      update: {
        quantity: { increment: quantity },
      },
    });

    return NextResponse.json({ success: true, cartItem });
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}