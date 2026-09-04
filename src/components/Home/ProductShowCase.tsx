"use client";

import { ShowcaseCard } from "./ProdcutCardShow";

// ✅ Category data with placeholder images
const categories = [
  {
    title: "New Arrivals",
    subtitle: "Fresh products, just in",
    href: "/collections/new-arrivals",
    ctaText: "Shop New Arrivals →",
    images: [
      "/assets/category/new-1.jpg",
      "/assets/category/new-2.jpg",
      "/assets/category/new-3.jpg",
      "/assets/category/new-4.jpg",
    ],
  },
  {
    title: "Shop All",
    subtitle: "Browse everything we offer",
    href: "/collections/shop-all",
    ctaText: "View All Products →",
    images: [
      "/assets/shopAll/new-1.jpg",
      "/assets/shopAll/new-2.jpg",
      "/assets/shopAll/new-3.jpg",
      "/assets/shopAll/new-4.jpg",
    ],
  },
  {
    title: "Best Rated",
    subtitle: "Our most-loved products",
    href: "/collections/best-products",
    ctaText: "Shop Bestsellers →",
    images: [
      "/assets/bestRated/new-1.jpg",
      "/assets/bestRated/new-2.jpg",
      "/assets/bestRated/new-3.jpg",
      "/assets/bestRated/new-4.jpg",
    ],
  },
  {
    title: "Sale",
    subtitle: "Save big on these deals",
    href: "/collections/sale",
    ctaText: "Shop Sale and discounts →",
    images: [
      "/assets/sale/new-1.jpg",
      "/assets/sale/new-2.jpg",
      "/assets/sale/new-3.jpg",
      "/assets/sale/new-4.jpg",
    ],
  },
];

export default function CategoryShowcase() {
  return (
    <div className="py-8 flex flex-col">
      {/* ✅ Section Header */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-textPrimary">
          Explore Collections
        </h2>
      </div>

      {/* ✅ Grid of Showcase Cards */}
      <div className="flex gap-2 w-330 md:w-fit md:self-center">
        {categories.map((category) => (
          <ShowcaseCard
            key={category.title}
            title={category.title}
            subtitle={category.subtitle}
            href={category.href}
            images={category.images}
            ctaText={category.ctaText}
          />
        ))}
      </div>
    </div>
  );
}