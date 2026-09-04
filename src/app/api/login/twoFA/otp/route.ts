import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { getOrCreateSession } from "@/lib/session";
export async function POST(req: NextRequest) {
  try {
    // 1. Get the twoFAToken cookie
    const cookieStore = await cookies();
    const twoFAToken = cookieStore.get("twoFAToken");

    if (!twoFAToken?.value) {
      return NextResponse.json(
        { success: false, error: "No 2FA token found" },
        { status: 401 },
      );
    }

    // 2. Decode the token to get the email
    let decoded: { email: string; fingerprint: string };
    try {
      decoded = jwt.verify(twoFAToken.value, process.env.JWT_SECRET!) as {
        email: string;
        fingerprint: string;
      };
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "2FA token expired or invalid" },
        { status: 401 },
      );
    }

    const email = decoded.email;

    // 3. Get the submitted OTP from the request body
    const { otp } = await req.json();
    const otpInput = Array.isArray(otp) ? otp.join('') : '';

    if (!otpInput || otpInput.length !== 6 || !/^\d{6}$/.test(otpInput)) {
      return NextResponse.json(
        { success: false, error: "Invalid OTP format" },
        { status: 400 },
      );
    }


    // 4. Fetch the twoFA record
    const record = await prisma.twoFA.findUnique({ where: { email } });
    if (!record) {
      return NextResponse.json(
        { success: false, error: "No OTP request found" },
        { status: 404 },
      );
    }

    // 5. Check attempts limit
    if (record.attempts >= 5) {
      await prisma.twoFA.delete({ where: { email } }); // clean up
      return NextResponse.json(
        { success: false, error: "Too many attempts. OTP rejected." },
        { status: 429 },
      );
    }

    // 6. Check expiration
    if (new Date() > record.expiresAt) {
      await prisma.twoFA.delete({ where: { email } });
      return NextResponse.json(
        { success: false, error: "OTP expired. Please request a new one." },
        { status: 401 },
      );
    }

    // 7. Compare OTP
    const otpMatches = record.otp === parseInt(otpInput as string, 10);
    if (!otpMatches) {
      // Increment attempts
      await prisma.twoFA.update({
        where: { email },
        data: { attempts: record.attempts + 1 },
      });
      const attemptsLeft = 5 - (record.attempts + 1);
      return NextResponse.json(
        {
          success: false,
          error: `Incorrect OTP. ${Math.max(attemptsLeft, 0)} attempts remaining.`,
        },
        { status: 401 },
      );
    }

    // 8. OTP valid – delete the record
    await prisma.twoFA.delete({ where: { email } });

    // 9. Fetch the user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // 10. Generate the final authToken
    const authToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        fingerprint: decoded.fingerprint,
        type: "authToken",
      },
      process.env.JWT_SECRET!,
      { expiresIn: "48h" },
    );

    const session = await getOrCreateSession(user.id, decoded.fingerprint, req);

    // 11. Create the response, set the authToken cookie, clear the twoFAToken
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        fingerprint: session.fingerprint,
      },
      type: "authToken",
    });

    response.cookies.set("authToken", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 48,
      path: "/",
    });

    // Clear the twoFAToken
    response.cookies.set("twoFAToken", "", {
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Verify 2FA error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
