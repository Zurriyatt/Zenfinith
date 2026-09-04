import { NextResponse, NextRequest } from "next/server";
import { SessionVerify } from "../verify/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(req: NextRequest) {
  try {
    const decoded = (await SessionVerify()).user;

    if (decoded.email === null) {
      return NextResponse.json({
        success: false,
        error: "You are not LoggedIn !",
      });
    }

    const data = await req.json();
    if(typeof data.currentPassword  !== typeof "string" || typeof data.newPassword  !== typeof "string" || typeof data.retypeNewPassword !== typeof "string" ){
      return NextResponse.json({success:false, error: "Invalid Arguements!"})
    }

    const encryptedNew = await bcrypt.hash(data.newPassword, 10);
    (decoded.email,"email")
    const User = await prisma.user.findUnique({
      where: { email: decoded.email },
    });
    if (!User?.passwordHash) {
      return NextResponse.json({
        success: false,
        error: "This is SingleClicked Auth Login",
      });
    }
    const passwordSaved = await bcrypt.compare(
      data.currentPassword,
      User?.passwordHash
    );
    if (!passwordSaved) {
      return NextResponse.json({
        success: false,
        error: "Wrong Password!",
      });
    }

    const changed = await prisma.user.update({
      where: { email: decoded.email },
      data: { passwordHash: encryptedNew }, 
    });

    return NextResponse.json({ success: true, res: "Password Changed!" });
  } catch (err) {
    let errror;
    if (err instanceof Error) {
      errror = err.message;
    } else {
      errror = "Unexpected Server Error!";
    }
    return NextResponse.json({ success: false, error: errror });
  }
}
