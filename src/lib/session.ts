import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function getOrCreateSession(
  userId: string,
  fingerprint: string,
  req?: NextRequest   // ✅ make optional
) {
  const existing = await prisma.session.findUnique({
    where: {
      userId_fingerprint: { userId, fingerprint },
    },
  });

  if (existing) {
    return await prisma.session.update({
      where: { id: existing.id },
      data: {
        lastUsedAt: new Date(),
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      },
    });
  }

  // Use fallback values if req is not provided
  const userAgent = req?.headers.get("user-agent") || "unknown";
  const ipAddress =
    req?.headers.get("x-forwarded-for") ||
    req?.headers.get("x-real-ip") ||
    "unknown";

  return await prisma.session.create({
    data: {
      userId,
      fingerprint,
      userAgent,
      ipAddress,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
    },
  });
}