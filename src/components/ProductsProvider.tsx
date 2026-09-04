"use client";
import { createContext, useContext } from "react";
import type { Product } from "@/lib/products";
const ProductsContext = createContext<Product[] | null>(null);

export function ProductsProvider({
  children,
  products,
}: {
  children: React.ReactNode;
  products: Product[];
}) {

  return (
    <ProductsContext.Provider value={products}>
      {children}
    </ProductsContext.Provider>
  );
}

export const useProducts = () => useContext(ProductsContext);