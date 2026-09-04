  import NextAuth from "next-auth";
  import GithubProvider from "next-auth/providers/github";
  import { defaultSettings } from "@/lib/defaultSettings";
  import GoogleProvider from "next-auth/providers/google";
  import { prisma } from "@/lib/prisma";
  import { User, Account } from "next-auth";
  import { Session } from "next-auth";
  import { JWT } from "next-auth/jwt";
  import { sendEmail } from "@/lib/email";
  import { getOrCreateSession } from "@/lib/session";
  interface CustomSession extends Session {
      user?: {
          name?: string | null;
          email?: string | null;
          image?: string | null;
          id: string;
      };
  }

  export const authOptions = {
      secret: process.env.NEXTAUTH_SECRET,
      session: {
          strategy: "jwt",
      },
      providers: [
          GithubProvider({
              clientId: process.env.GITHUB_CLIENT_ID as string,
              clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
          }),
          GoogleProvider({
              clientId: process.env.GOOGLE_CLIENT_ID as string,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          }),
      ],
      callbacks: {
          async jwt({ token, user, account }: { token: JWT; user?: User | null; account?: Account | null }) {
              if (account && !token.fingerprint) {
                  try {
                      const url = new URL((account.callbackUrl as string) ?? "");
                      const metaParam = url.searchParams.get("meta");
                      if (metaParam) {
                          const decoded = JSON.parse(atob(metaParam));
                          if (decoded.fingerprint) {
                              token.fingerprint = decoded.fingerprint;
                          }
                      }
                  } catch (e) {
                      console.error("Failed to extract fingerprint from meta", e);
                  }
              }

              // This runs: first time user signs in, then on every token refresh
              if (user) {
                  // User just signed in (via OAuth). Upsert into your DB and get the id.
                  const dbUser = await prisma.user.findUnique({
                      where: { email: user.email! },
                  });
                  await sendEmail({
                      to: user.email as string,
                      subject: "New Login Detected!",
                      html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
              <h2 style="font-size: 18px; font-weight: 600; color: #111827; margin-top: 0; margin-bottom: 16px;">New sign-in detected</h2>
              <p style="font-size: 14px; line-height: 1.5; color: #4b5563; margin-bottom: 20px;">We noticed a new login to your account, ${user.email} from a new device.</p>

          </div>
          `,
                  });

                  // Store the DB id in the token
                  if (dbUser === null || dbUser === undefined) {
                      const createUser = await prisma.user.create({
                          data: {
                              name: user.name as string,
                              email: user.email as string,
                              passwordHash: "",
                              profileImage: user.image as string,
                          },
                      });
                      const settings = await prisma.settings.create({
                          data: { id: createUser.id, settingsJson: defaultSettings }, // link settings to user
                      });

                      token.id = createUser.id;
                  } else {
                      token.id = dbUser.id;
                  }
                  // Use real fingerprint if available, else use a fallback like "oauth-" + userId
                  const fallbackFingerprint = (token.fingerprint as string) || `oauth-${token.id}`;

                  // Call session creation/update (req is undefined, so userAgent/ip will be "unknown")
                  await getOrCreateSession(token.id as string, fallbackFingerprint);
              }
              return token;
          },
          async session({ session, token }: { session: CustomSession; token: JWT }) {
              // Make the id available on the client
              if (session.user) {
                  
                  session.user.id = token.id as string;
              }
              return session;
          },
      },
  };
  const handler = NextAuth(authOptions as any);

  export { handler as GET, handler as POST };
