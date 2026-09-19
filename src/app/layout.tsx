import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { prisma } from "@/lib/prisma";
import { SettingsState } from "@/lib/redux/settingsSlice";
import VisibleLayout from "./visibleLayout";
import { cn } from "@/lib/utils";
import { SessionVerify } from "./api/user/verify/route";
import SettingsProvider from "@/components/SettingsComponents/settingsProvider";
import { getServerSession } from "next-auth";
import { Session } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { Product } from "@/lib/products";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const STORE_NAME = "Zenfinith";
const STORE_URL = "https://zenfinith.vercel.app";
const STORE_DESCRIPTION =
    "Zenfinith — AI-powered fashion & lifestyle store. Discover smart personalized recommendations, premium minimalist streetwear, and fast shipping.";

export const viewport: Viewport = {
    themeColor: "#000000",
    width: "device-width",
    initialScale: 1,
};

export const metadata: Metadata = {
    metadataBase: new URL(STORE_URL),

    title: {
        default: `${STORE_NAME} | Premium Minimalist Streetwear & AI Fashion`,
        template: `%s | ${STORE_NAME}`,
    },

    description: STORE_DESCRIPTION,

    keywords: [
        "Zenfinith",
        "Zen Finith",
        "online clothing store",
        "aesthetic streetwear store",
        "baggy shirts men",
        "oversized streetwear",
        "minimalist fashion",
        "baggy trousers men",
        "men accessories",
        "AI recommendation store",
        "AI powered fashion store",
        "smart personalized shopping",
    ],

    // Let Next.js handle canonical paths dynamically instead of hardcoding '/'
    alternates: {
        canonical: "./",
    },

    verification: {
        google: "-dS99ccbGJYK6v8eT0CSOObrNmAkkeCTw89ka86sC9g",
    },

    openGraph: {
        type: "website",
        locale: "en_US",
        url: STORE_URL,
        siteName: STORE_NAME,
        title: `${STORE_NAME} | Premium Minimalist Streetwear`,
        description: STORE_DESCRIPTION,
        images: [
            {
                url: "/opengraph-image.png", // Place an optimized 1200x630 image in your /public folder
                width: 1200,
                height: 630,
                alt: `${STORE_NAME} Streetwear & Fashion Collection`,
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: `${STORE_NAME} | Premium Minimalist Streetwear`,
        description: STORE_DESCRIPTION,
        images: ["/opengraph-image.png"],
        creator: "@zenfinith",
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

    let initialProducts: Product[] = [];
    const User = (await SessionVerify()).user;

    if (User?.id) {
        const cart = await prisma.cart.findMany({ where: { userId: User.id } });
        const liked = await prisma.liked.findMany({ where: { userId: User.id } });

        const cartMap = new Map(cart.map((i) => [i.productId, i.quantity]));
        const likedSet = new Set(liked.map((i) => i.productId));

        initialProducts = products.map((product) => ({
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
            qtyInCart: cartMap.get(product.id) || 0,
            category: product.category as Product["category"],
        }));
    } else {
        initialProducts = products.map((product) => ({
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
        }));
    }

    // Schema Markup (JSON-LD) for Search Engines
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "OnlineStore",
        name: STORE_NAME,
        url: STORE_URL,
        description: STORE_DESCRIPTION,
        potentialAction: {
            "@type": "SearchAction",
            target: `${STORE_URL}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
        },
    };

    return (
        <html lang="en" className={cn("h-full dark antialiased", geistSans.variable, geistMono.variable, "font-sans")}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
                />
            </head>
            <body className="min-h-screen flex flex-col">
                <SettingsProvider preloadedSettings={settings}>
                    <VisibleLayout session={session} initialProducts={initialProducts}>
                        {children}
                    </VisibleLayout>
                </SettingsProvider>
            </body>
        </html>
    );
}
