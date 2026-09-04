import { NextRequest, NextResponse } from "next/server";
import { SessionVerify } from "../../../verify/route";
import { prisma } from "@/lib/prisma";
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await SessionVerify();
        if (!session.success || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const paramss = await params;
        const cartItemId = paramss.id;

        // Ensure the cart item belongs to the user
        const cartItem = await prisma.cart.findUnique({
            where: { userId_productId: { productId: cartItemId, userId: session.user.id } },
        });

        if (!cartItem || cartItem.userId !== session.user.id) {
            return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
        }
        let {quantity} = await req.json();
        // Update quantity
        let updated;
        if (quantity <= 0) {
            updated = await prisma.cart.delete({
                where: {
                    userId_productId: {
                        userId: session.user.id,
                        productId: cartItemId,
                    },
                },
            });
        } else {
            updated = await prisma.cart.update({
                where: {
                    userId_productId: {
                        userId: session.user.id,
                        productId: cartItemId,
                    },
                },
                data: { quantity: quantity },
            });
        }

        return NextResponse.json({ success: true, cartItem: updated });
    } catch (error) {
        console.error("Update cart error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
