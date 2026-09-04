import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { SessionVerify } from "@/app/api/user/verify/route"; // adjust path if needed

export async function DELETE(req: NextRequest) {
  try {
    const session = await SessionVerify();
    if (!session.success || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete all cart items for this user
    const result = await prisma.cart.deleteMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}