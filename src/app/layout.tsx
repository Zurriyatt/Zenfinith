import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { prisma } from "@/lib/prisma";
import { SettingsState } from "@/lib/redux/settingsSlice";
import VisibleLayout from "./visibleLayout";
import { cn } from "@/lib/utils";
import { defaultSettings } from "@/lib/defaultSettings";
import { SessionVerify } from "./api/user/verify/route";
import SettingsProvider from "@/components/SettingsComponents/settingsProvider";
import { getServerSession } from "next-auth";
import { Session } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { Product } from "@/lib/products";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const STORE_NAME = "Zenfinith"; // Change to your store name
const STORE_URL = "https://zenfinith.vercel.app"; // Change to your vercel URL

export const metadata: Metadata = {
    metadataBase: new URL(STORE_URL),

    title: {
        default: `${STORE_NAME} | Premium Online Shopping`,
        template: `%s | ${STORE_NAME}`, // Turns subpages into: "Running Shoes | SwiftStore"
    },
    verification: {
        google: "-dS99ccbGJYK6v8eT0CSOObrNmAkkeCTw89ka86sC9g",
    },

    description: 'Zenfinith — AI-powered fashion & lifestyle store. Discover smart personalized recommendations, premium minimalist streetwear, and fast shipping.',

    keywords: [
        // Brand
        "Zenfinith",
        "Zen Finith",
        "Zenfinith store",

        // Niche + Store terms
        "online clothing store",
        "fashion online store",
        "aesthetic streetwear store",

        // Products
        "baggy shirts men",
        "oversized streetwear",
        "minimalist fashion",
        "baggy trousers men",
        "Men Accessories",

        // AI Feature 
        "AI recommendation store",
        "AI powered fashion store",
        "smart personalized shopping",
        "AI curated streetwear",
    ],

    // Canonical tag prevents duplicate content issues (e.g. tracking links like ?ref=facebook)
    alternates: {
        canonical: "/",
    },

    // OpenGraph (Facebook, WhatsApp, LinkedIn, Discord)
    openGraph: {
        title: `${STORE_NAME} | Premium Online Shopping`,
        description: "Shop top quality products with fast delivery.",
        url: STORE_URL,
        siteName: STORE_NAME,
        locale: "en_US",
        type: "website",
    },

    // Twitter Cards
    twitter: {
        card: "summary_large_image",
        title: STORE_NAME,
        description: "Shop top quality products with fast delivery.",
        creator: "@zenfinith", // Optional: your Twitter handle
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    let settings: SettingsState | undefined = undefined;
    const session = (await getServerSession(authOptions as any)) as Session;

    const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
    });

    let initialProducts: Product[] | null = [];

    const User = (await SessionVerify()).user;

    if (User.id) {
        const cart = await prisma.cart.findMany({
            where: { userId: User.id },
        });
        const liked = await prisma.liked.findMany({
            where: { userId: User.id },
        });
        const cartMap = new Map();
        cart.forEach((item) => {
            cartMap.set(item.productId, item.quantity);
        });
        const likedSet = new Set(liked.map((item) => item.productId));
        products.forEach((product, idx) => {
            initialProducts.push({
                id: product.id,
                description: product.description,
                name: product.name,
                price: product.price,
                oldPrice: product.oldPrice || undefined,
                rating: product.rating as number,
                reviewsCount: product.reviewsCount as number,
                images: product.images,
                badge: product.badge,
                totalDiscount: product.totalDiscount as number,
                isInCart: cartMap.has(product.id),
                isLiked: likedSet.has(product.id),
                qtyInCart: cartMap.get(product.id),
                category: product.category as Product["category"],
            });
        });
    } else {
        products.forEach((product, idx) => {
            initialProducts.push({
                id: product.id,
                description: product.description,
                name: product.name,
                price: product.price,
                oldPrice: product.oldPrice || undefined,
                rating: product.rating as number,
                reviewsCount: product.reviewsCount as number,
                images: product.images,
                badge: product.badge,
                isInCart: false,
                isLiked: false,
                qtyInCart: 0,
                totalDiscount: product.totalDiscount as number,
                category: product.category as Product["category"],
            });
        });
    }
    // Map to your custom Product type if needed

    return (
        <html
            lang="en"
            className={cn(
                `h-full dark`,
                "antialiased",
                geistSans.variable,
                geistMono.variable,
                "font-sans",
                inter.variable,
            )}
        >
            <body className="min-h-screen flex flex-col ">
                <SettingsProvider preloadedSettings={settings}>
                    <VisibleLayout session={session} children={children} initialProducts={initialProducts} />
                </SettingsProvider>
            </body>
        </html>
    );
}
