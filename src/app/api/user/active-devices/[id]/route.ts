import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { SessionVerify } from "@/app/api/user/verify/route";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await SessionVerify();
    if (!session.success || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const device = await prisma.session.findUnique({ where: { id } });
    if (!device || device.userId !== session.user.id) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    await prisma.session.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Revoke device error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}