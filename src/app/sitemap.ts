import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { collections } from "@/app/collections/collectionData"; // optional, if you want dynamic collection pages

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://zenfinith.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Dynamic product pages from database
  let productUrls: MetadataRoute.Sitemap = [];
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        createdAt: true,
      },
    });

    productUrls = products.map((product) => ({
      url: `${BASE_URL}/products/${product.id}`,
      lastModified: product.createdAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    }));
  } catch (error) {
    console.error("Sitemap DB Error:", error);
  }

  // 2. Static collection pages
  // Instead of hardcoding, you can map from your `collections` data
  const collectionUrls: MetadataRoute.Sitemap = collections.map((collection) => ({
    url: `${BASE_URL}/collections/${collection.id}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  // 3. Other important static pages
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/collections`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    // Support & informational pages
    {
      url: `${BASE_URL}/help`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/returns`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/shipping`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  return [...staticUrls, ...collectionUrls, ...productUrls];
}