import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { decode } from "next-auth/jwt";
import jwt from "jsonwebtoken";
export interface authTokentype {
    id: string;
    email: string;
    fingerprint: string;
    type: string;
}

export interface fatoken {
    email: string;
    fingerprint: string;
}
export interface SessionResult {
    success: boolean;
    user: {
        name: string | null;
        id: string | null;
        email: string | null;
        profileImage: string | null;
        coverImage: string | null;
        bio: string | null;
        fingerprint: string | null;
    };
    error: string | null;
}

export async function SessionVerify(): Promise<SessionResult> {
    try {
        const cookieStore = await cookies();
        const authToken = cookieStore.get("authToken");

        if (authToken !== undefined) {
            const verifiedToken = jwt.verify(authToken.value, process.env.JWT_SECRET as string) as authTokentype;

            // ✅ NEW: Check session existence
            const session = await prisma.session.findUnique({
                where: {
                    userId_fingerprint: {
                        userId: verifiedToken.id,
                        fingerprint: verifiedToken.fingerprint,
                    },
                },
            });

            if (!session || session.expiresAt < new Date()) {
                cookieStore.delete("authToken");
                return {
                    success: false,
                    user: {
                        name: null,
                        id: null,
                        email: null,
                        profileImage: null,
                        coverImage: null,
                        bio: null,
                        fingerprint: null,
                    },
                    error: "Session revoked or expired",
                };
            }

            const dbData = await prisma.user.findUnique({
                where: { id: verifiedToken.id },
            });
            return {
                success: true,
                user: {
                    name: dbData?.name || null,
                    id: dbData?.id || null,
                    email: dbData?.email || null,
                    profileImage: dbData?.profileImage || null,
                    coverImage: dbData?.coverImage || null,
                    bio: dbData?.bio || null,
                    fingerprint: verifiedToken.fingerprint,
                },
                error: null,
            };
        }

        const cookieNextAuthToken =
            cookieStore.get("__Secure-next-auth.session-token") || cookieStore.get("next-auth.session-token");

        if (cookieNextAuthToken !== undefined) {
            const nextAuthToken = await decode({
                token: cookieNextAuthToken.value,
                secret: process.env.NEXTAUTH_SECRET as string,
            });
            if (nextAuthToken && nextAuthToken.id) {
                const userId = nextAuthToken.id as string;
                const fingerprint = (nextAuthToken.fingerprint as string) || `oauth-${userId}`;

                const dbData = await prisma.user.findUnique({ where: { id: userId } });
                if (!dbData) {
                    return {
                        success: false,
                        user: {
                            name: null,
                            id: null,
                            email: null,
                            profileImage: null,
                            coverImage: null,
                            bio: null,
                            fingerprint: null,
                        },
                        error: "User not found",
                    };
                }

                const session = await prisma.session.findUnique({
                    where: {
                        userId_fingerprint: { userId, fingerprint },
                    },
                });

                if (!session || session.expiresAt < new Date()) {
                    // Optionally clear both authToken and NextAuth cookies
                    cookieStore.delete("authToken");
                    cookieStore.delete("next-auth.session-token");
                    cookieStore.delete("__Secure-next-auth.session-token");
                    return {
                        success: false,
                        user: {
                            name: null,
                            id: null,
                            email: null,
                            profileImage: null,
                            coverImage: null,
                            bio: null,
                            fingerprint: null,
                        },
                        error: "Session revoked or expired",
                    };
                }

                return {
                    success: true,
                    user: {
                        name: dbData.name,
                        id: dbData.id,
                        email: dbData.email,
                        profileImage: dbData.profileImage,
                        coverImage: dbData.coverImage,
                        bio: dbData.bio,
                        fingerprint: fingerprint,
                    },
                    error: null,
                };
            }
        }

        const twoFAToken = cookieStore.get("twoFAToken");
        if (twoFAToken?.value) {
            try {
                const decodeToken = jwt.verify(twoFAToken.value, process.env.JWT_SECRET as string) as fatoken;

                if (decodeToken) {
                    return {
                        success: false,
                        user: {
                            email: decodeToken.email,
                            name: null,
                            id: null,
                            profileImage: null,
                            coverImage: null,
                            bio: null,
                            fingerprint: decodeToken.fingerprint,
                        },
                        error: null,
                    };
                }
                // Token is valid. Proceed with login/2FA logic.
            } catch (error) {
                if (error instanceof Error) {
                    console.error("JWT Verification failed:", error.message);
                }
                // Token is invalid or expired. Handle the error.
                console.error("JWT Verification failed:");
                return {
                    success: false,
                    user: {
                        name: null,
                        id: null,
                        email: null,
                        profileImage: null,
                        coverImage: null,
                        bio: null,
                        fingerprint: null,
                    },
                    error: "JWT VERIFICATION FAILURE!",
                };
            }
        }
        return {
            success: false,
            user: {
                name: null,
                id: null,
                email: null,
                profileImage: null,
                coverImage: null,
                bio: null,
                fingerprint: null,
            },
            error: "Possibly, You are not logged In!",
        };
    } catch (err) {
        console.error("JWT verification failed:", err);
        return {
            success: false,
            user: {
                name: null,
                id: null,
                email: null,
                profileImage: null,
                coverImage: null,
                bio: null,
                fingerprint: null,
            },
            error: "Invalid or expired token",
        };
    }
}

export async function GET() {
    return NextResponse.json({ success: false, error: "Not an endpoint" });
}
