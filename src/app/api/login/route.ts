import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SettingsState } from "@/lib/redux/settingsSlice";
import { defaultSettings } from "@/lib/defaultSettings";
import { getOrCreateSession } from "@/lib/session";
import { sendEmail } from "@/lib/email";
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { email, password, fingerprint } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 },
      );
    }

    if (!fingerprint) {
      return NextResponse.json(
        { success: false, error: "Device fingerprint is required" },
        { status: 400 },
      );
    }

    // 1. Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Account doesn't exist!" },
        { status: 401 },
      );
    }

    // 2. Verify password
    const verified = await bcrypt.compare(password, user.passwordHash);
    if (!verified) {
      return NextResponse.json(
        { success: false, error: "Incorrect password!" },
        { status: 401 },
      );
    }

    // 3. Check if this device already has a session
    const session = await getOrCreateSession(user.id, fingerprint, req)
    const twoFAuth = await prisma.settings.findUnique({
      where: { id: user.id },
    });

    const settings = (twoFAuth?.settingsJson as SettingsState) ?? defaultSettings;

    console.log(settings, "i am settings", settings?.security);
    let token;
    if (settings.security["2fa"]) {
      token = jwt.sign(
        {
          email: user.email,
          fingerprint: fingerprint,
          type: "twoFAToken"
        },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" },
      );
      const response = NextResponse.json({
        success: true,
        user: null,
        session: null,
        type: "twoFAToken"
      });
      response.cookies.set("twoFAToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60,
        path: "/",
      });
      return response
    } else {
      // 4. Generate JWT with fingerprint
      token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          fingerprint,
          type: "authToken"
        },
        process.env.JWT_SECRET!,
        { expiresIn: "48h" },
      );
    }
    // 5. Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      session: {
        id: session.id,
        fingerprint: session.fingerprint,
        expiresAt: session.expiresAt,
      },
      type: "authToken"
    });
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 48,
      path: "/",
    });

    await sendEmail({
      to: user.email,
      subject: "Your Zenfinith 2FA Code",
      html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
     <h2 style="font-size: 18px; font-weight: 600; color: #111827; margin-top: 0; margin-bottom: 16px;">New sign-in detected</h2>
            <p style="font-size: 14px; line-height: 1.5; color: #4b5563; margin-bottom: 20px;">We noticed a new login to your account, ${user.email} from a new device.</p>
</div>
`,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
