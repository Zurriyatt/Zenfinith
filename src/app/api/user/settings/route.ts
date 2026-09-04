import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { SessionVerify } from "../verify/route";
import { defaultSettings } from "@/lib/defaultSettings";
// GET – fetch current user settings
export async function GET(request: NextRequest) {
  const session = await SessionVerify();
  if (!session.success || !session.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { settings: true },
  });

  // If no settings row yet, create one with your defaultSettings
  if (!user?.settings) {
    const defaultPreferences = defaultSettings; // import your defaultSettings
    await prisma.settings.create({
      data: {
        id: session.user.id,
        settingsJson: defaultPreferences,
      },
    });
    return NextResponse.json({ success: true, settings: defaultPreferences });
  }

  return NextResponse.json({ success: true, settings: user.settings.settingsJson });
}
// PUT – update all settings at once
export async function PUT(request: NextRequest) {
  const session = await SessionVerify();
  if (!session.success || !session.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await request.json(); // the full nested settings object from the frontend

  const updated = await prisma.settings.upsert({
    where: { id: userId },
    create: {
      id: userId,
      settingsJson: body,
    },
    update: {
      settingsJson: body,
    },
  });

  return NextResponse.json({ success: true, settings: body });
}