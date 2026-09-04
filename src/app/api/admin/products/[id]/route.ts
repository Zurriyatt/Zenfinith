import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { SessionVerify } from "@/app/api/user/verify/route";
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }>}
) {
  try {
    // Admin check
    const session = await SessionVerify();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const productId = (await params).id;
    console.log(params,productId)
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete product
    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Product delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}