import ProductListing from "../productListing";
export default function SalePage() {
  return (
    <ProductListing
      category="shop-all"
      title="Shop All"
      description="Zenfinith All Products"
      saleOnly={false}
    />
  );
}