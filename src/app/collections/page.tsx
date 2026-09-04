"use client";
import { collections } from "./collectionData";
import { AllSections } from "@/components/collections/allSections";
import ProductSectionPreview from "@/components/collections/productSectionPreview";
import { useProducts } from "@/components/ProductsProvider";

export default function CollectionsPage() {
  const products = useProducts()
  return (
    <div className="w-full ">
      <AllSections />
      {/* For demo, reuse demoProducts for all sections. Replace with actual mapping later. */}
      {collections.map((col) => (
        <ProductSectionPreview
          key={col.id}
          title={col.title}
          products={products as []} // show 5 products
          viewAllHref={col.href}
          category={col.id}
        />
      ))}
    </div>
  );
}