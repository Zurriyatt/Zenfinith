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

export const metadata: Metadata = {
  title: "Zenfinith",
  description: "Zenfith - e-commerce app",
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
      
    })
    const liked = await prisma.liked.findMany({
      where: { userId: User.id },
      
    })
    const cartMap = new Map();
    cart.forEach(item => {
      cartMap.set(item.productId, item.quantity);
    });
    const likedSet = new Set(liked.map(item => item.productId));
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
        isLiked:likedSet.has(product.id),
        qtyInCart:cartMap.get(product.id),
        category: product.category as Product["category"]
      })
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
        isLiked:false,
        qtyInCart:0,
        totalDiscount: product.totalDiscount as number,
        category: product.category as Product["category"]
      })
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
