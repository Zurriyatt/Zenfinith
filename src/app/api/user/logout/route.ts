import { NextResponse, NextRequest } from "next/server";
import { SessionVerify } from "../verify/route";

interface ReturnTypeOfPromise {
  success: boolean;
  error: null | string;
  res: null | string;
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ReturnTypeOfPromise>> {
  try {
    const fetchData = await SessionVerify();
    
    const response = NextResponse.json<ReturnTypeOfPromise>({
      success: true,
      res: "Logout Sucessful!",
      error: null,
    });

    // 1. Clear your custom authToken with its specific configuration
    response.cookies.set("authToken", "", {
      maxAge: 0,
      path: "/",
      sameSite: "strict", 
      secure: true
    });

    // 2. Clear NextAuth tokens using 'lax'
    const nextAuthCookies = [
      "next-auth.session-token",
      "__Secure-next-auth.session-token",
      "next-auth.callback-url",
      "__Secure-next-auth.callback-url"
    ];

    nextAuthCookies.forEach((cookieName) => {
      response.cookies.set(cookieName, "", {
        maxAge: 0,
        path: "/",
        sameSite: "lax",
      });
    });

    return response;

  } catch (err) {
    let errorMessage = "Unexpected Server crash";
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    return NextResponse.json<ReturnTypeOfPromise>(
      { success: false, error: errorMessage, res: null },
      { status: 500 },
    );
  }
}
