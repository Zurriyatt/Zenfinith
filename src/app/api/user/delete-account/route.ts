import { NextResponse, NextRequest } from "next/server";
import { SessionVerify } from "../verify/route";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
export async function POST(req: NextRequest) {

  try {
    const cookieStore = await cookies();
    const decoded = (await SessionVerify()).user;

    if (decoded.email === null) {
      return NextResponse.json({
        success: false,
        error: "You are not LoggedIn !",
      });
    }

        const User = await prisma.user.findUnique({
      where: { email: decoded.email },
    });
    if (!User) {
      return NextResponse.json({
        success: false,
        error: "Account Doesn't Exist",
      });
    }

    await prisma.user.delete({
      where : {email : decoded.email}
    })

    cookieStore.delete("authToken")
    cookieStore.delete("next-auth.session-token")
    
    return NextResponse.json({success:true ,res: "Account Deleted Successfully!"})
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
