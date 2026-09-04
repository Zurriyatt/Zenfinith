import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { buildInvoiceHtml } from "@/lib/buildinvoice";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
        return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    try {
        // Retrieve Stripe Checkout Session
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === "paid") {
            const orderId = session.metadata?.orderId;
            const userId = session.client_reference_id;

            if (!orderId || !userId) {
                return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
            }

            // Update order to PAID
            await prisma.order.update({
                where: { id: orderId },
                data: { status: "PAID" },
            });

            // Clear cart
            await prisma.cart.deleteMany({
                where: { userId },
            });

            // Increment coupon usage if used
            const couponCode = session.metadata?.couponCode;
            if (couponCode) {
                await prisma.coupon.update({
                    where: { code: couponCode },
                    data: { usedCount: { increment: 1 } },
                });
            }
            const order = await prisma.order.findUnique({
                where: { id: orderId },
                include: { items: true },
            });

            if (order) {
                await sendEmail({
                    to: order.email,
                    subject: `Zenfinith Order Confirmation #${order.id}`,
                    html: buildInvoiceHtml(order),
                });
            }

            return NextResponse.json({ success: true, order });

            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, error: "Payment not completed" }, { status: 400 });
        }
    } catch (error) {
        console.error("Confirmation error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


