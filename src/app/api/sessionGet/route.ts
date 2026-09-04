import { NextRequest, NextResponse } from "next/server";
import { SessionVerify } from "../user/verify/route";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const data = await SessionVerify();

    if (data.error) {
      const response = NextResponse.json({
        success: false,
        error: data.error,
      });

      // Clear auth cookies on revoked/expired session
      response.cookies.delete("authToken");
      response.cookies.delete("next-auth.session-token");
      response.cookies.delete("__Secure-next-auth.session-token");

      return response;
    }

    return NextResponse.json({ success: true, res: data.user });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Unexpected Error!" });
  }
}