import { NextResponse, NextRequest, userAgent } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { getOrCreateSession } from "@/lib/session";
import { SessionVerify } from "@/app/api/user/verify/route";
import { sendEmail } from "@/lib/email";
  interface decoded {
    email: string | null;
    name: string | null;
    id: string | null;
    profileImage: string | null;
    coverImage: string | null;
    bio: string | null;
    fingerprint:string|null
}
export async function POST(req: NextRequest) {
  try {
    // 2. Decode the token to get the email
    let decoded:decoded;
    try {
      decoded = (await SessionVerify()).user
      if(decoded.email === null){
    return NextResponse.json(
        { success: false, error: "2FA token expired or invalid, Try to Relogin!" },
        { status: 401 }
      );
      }
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "2FA token expired or invalid" },
        { status: 401 }
      );
    }

    const email = decoded.email;
    if(email === null){
      return NextResponse.json(
        { success: false, error: "Your Token Expired, Relogin!" },
        { status: 400 }
      );
    }
    if(decoded.id !== null){
      return NextResponse.json(
        { success: false, error: "You are already LoggedIN!" },
        { status: 400 }
      );
    }
    // 3. Check if an OTP record already exists for this email
    const existing = await prisma.twoFA.findUnique({ where: { email: email } });

    if (existing && new Date() < existing.expiresAt) {
      console.log(new Date(), existing.expiresAt)
      // Cooldown: still valid OTP exists → reject
      const secondsLeft = Math.ceil((existing.expiresAt.getTime() - Date.now()) / 1000);
      return NextResponse.json(
        { success: false, error: `Please wait ${secondsLeft}s before requesting a new code` },
        { status: 429 }
      );
    }

    // 4. Generate a new 6‑digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // 5. Upsert the twoFA record (overwrite expired or create new)
    await prisma.twoFA.upsert({
      where: { email },
      create: {
        email,
        otp,
        attempts: 0,
        expiresAt: new Date(Date.now() + 10 * 60  * 1000), // 10 minutes
      },
      update: {
        otp,
        attempts: 0,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    // 6. Send the OTP via email
    await sendEmail({
      to: email,
      subject: "Your Zenfinith 2FA Code",
      html: `<p>Your verification code is <strong>${otp}</strong></p>`,
    });
    
    return NextResponse.json({ success: true,data:{email:decoded.email}, message: "Code sent to your email" });
  } catch (error) {
    console.error("Generate OTP error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate code" },
      { status: 500 }
    );
  }

}