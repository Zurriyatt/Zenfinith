import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductClient from "@/components/productPage/productClient";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

const STORE_URL = "https://zenfinith.vercel.app";
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Helper function to fetch product info for SEO & JSON-LD
async function getProduct(id: string) {
  if (!UUID_REGEX.test(id)) return null;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        images: true,
        price: true,
        rating: true,
        reviewsCount: true,
        badge: true,
      },
    });
    return product;
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return null;
  }
}

// 1. Dynamic Metadata Generator (Runs on Server)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product does not exist.",
    };
  }

  const ogImage = product.images?.[0] || "/opengraph-image.png";

  return {
    title: product.name,
    description:
      product.description.slice(0, 160) || `Buy ${product.name} at Zenfinith`,
    alternates: {
      canonical: `/products/${id}`,
    },
    openGraph: {
      title: product.name,
      description:
        product.description.slice(0, 160) || `Buy ${product.name} at Zenfinith`,
      url: `/products/${id}`,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description.slice(0, 160),
      images: [ogImage],
    },
  };
}

// 2. Server Page Component with Schema.org JSON-LD
export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  // Build Schema.org JSON-LD Object
  const jsonLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.length > 0 ? product.images : [`${STORE_URL}/opengraph-image.png`],
    description: product.description || `Buy ${product.name} online at Zenfinith.`,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "Zenfinith",
    },
    offers: {
      "@type": "Offer",
      url: `${STORE_URL}/products/${id}`,
      priceCurrency: "USD",
      price: product.price.toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  // Only attach rating to schema if product actually has reviews (prevents Google Schema warnings)
  if (product.reviewsCount && product.reviewsCount > 0 && product.rating) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewsCount,
    };
  }

  return (
    <>
      {/* Schema.org Structured Data for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Your Interactive Client Component */}
      <ProductClient id={id} />
    </>
  );
}