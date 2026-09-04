import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { defaultSettings } from "@/lib/defaultSettings";
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();

    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User already exists" },
        { status: 409 },
      );
    }

    const salts = 10;
    const hashedPass = await bcrypt.hash(password, salts);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPass,
        name,
      },
    });
    const settings = await prisma.settings.create({
      data: { id: user.id,settingsJson: defaultSettings }, // link settings to user
      
    });

    // 5. Return success (exclude password)
    return NextResponse.json({
      success: true,
      res: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
