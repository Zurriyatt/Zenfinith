import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { SessionVerify } from "@/app/api/user/verify/route";

export async function DELETE(
  req: NextRequest,
  { params }: { params:Promise<{ id: string }>}
) {
  try {
    const session = await SessionVerify();
    if (!session.success || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const paramss = await params
    const productId =  paramss.id;

    // Find the liked item for this user and product
    const likedItem = await prisma.liked.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productId,
        },
      },
    });

    if (!likedItem) {
      return NextResponse.json({ error: "Liked item not found" }, { status: 404 });
    }

    await prisma.liked.delete({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Remove from liked error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}