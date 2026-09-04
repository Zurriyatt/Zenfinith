export interface Collection {
  id: string;
  title: string;
  description: string;
  image: string;        // Local public directory path
  href: string;
  span?: "large" | "tall" | "normal";  // for bento grid layout
  badge: string;       // e.g. "New", "Sale"
}

export const collections: Collection[] = [
  {
    id: "new-arrivals",
    title: "New Arrivals",
    description: "Fresh drops added this week",
    image: "/assets/collections/allCollections/shop.png",
    href: "/collections/new-arrivals",
    span: "large",
    badge: "New",
  },
  {
    id: "sale",
    title: "Sale",
    description: "Up to 65% off",
    image: "/assets/collections/allCollections/sale.jpg",
    href: "/collections/sale",
    span: "large",
    badge: "Sale",
  },
  {
    id: "men",
    title: "Men",
    description: "Styles for every occasion",
    image: "/assets/collections/allCollections/men.png",
    href: "/collections/men",
    span: "normal",
    badge: "Men Section",
  },
  {
    id: "women",
    title: "Women",
    description: "Curated for you",
    image: "/assets/collections/allCollections/women1.png",
    href: "/collections/women",
    span: "normal",
    badge: "Woman Section",
  },
  {
    id: "best-products",
    title: "Best Products",
    description: "The finishing touch",
    image: "/assets/collections/allCollections/bestProducts.png",
    href: "/collections/best-products",
    span: "tall",
    badge: "BestProducts Section",
  },
   {
    id: "accessories",
    title: "Accessories",
    description: "The finishing touch",
    image: "/assets/collections/allCollections/Accessories.png",
    href: "/collections/accessories",
    span: "tall",
    badge: "Accessories Section",
  },
    {
    id: "shop-all",
    title: "Shop All",
    description: "Browse the full catalogue",
    image: "/assets/collections/allCollections/shopAll1.png",
    href: "/collections/shop-all",
    span: "normal",
    badge: "ShopAll",
  },
];