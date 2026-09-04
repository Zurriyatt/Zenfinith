  import Link from "next/link";
  import { ArrowRight, Divide } from "lucide-react";
  import ProductCard from "./ProductCard";
  import type { Product } from "@/lib/products";

  interface Props {
    category : string;
    title: string;
    products: Product[];
    viewAllHref: string;
  }

  export default function ProductSectionPreview({ title, products, viewAllHref,category }: Props) {
    return (
    
      <section className="w-full mt-10">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-textPrimary">
            {title}
          </h2>
          <Link
            href={viewAllHref}
            className="group flex items-center gap-1 text-sm font-medium text-textPrimary/70 hover:text-active transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Products container */}
        <div className="max-w-[98vw] flex gap-4 overflow-x-auto snap-x  md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:overflow-visible">
          {products.map((product,idx) => {
            if (product.category === category){ return (
              <div key={product.id} className="min-w-[180px] max-w-[180px] sm:min-w-[220px] sm:max-w-[220px] md:min-w-0 md:max-w-none">
                <ProductCard product={product} />
              </div>)}else
            if(title ==="Shop All"){
              if(idx<=5){
              return(
              <div key={product.id} className="min-w-[180px] max-w-[180px] sm:min-w-[220px] sm:max-w-[220px] md:min-w-0 md:max-w-none">
                <ProductCard product={product} />
              </div>)}
            }else
            if(title ==="Sale"){
              if(product.totalDiscount>35){
              return(
              <div key={product.id} className="min-w-[180px] max-w-[180px] sm:min-w-[220px] sm:max-w-[220px] md:min-w-0 md:max-w-none">
                <ProductCard product={product} />
              </div>)}
            }
          })}
        </div>
      </section>
    );
  }