import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { SessionVerify } from "@/app/api/user/verify/route";

export async function GET(req: NextRequest) {
  try {
    const session = await SessionVerify();
    if (!session.success || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const devices = await prisma.session.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        fingerprint: true,
        userAgent: true,
        ipAddress: true,
        lastUsedAt: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: { lastUsedAt: "desc" },
    });

    return NextResponse.json({ success: true, devices });
  } catch (error) {
    console.error("Active devices error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}