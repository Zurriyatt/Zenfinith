import ProductListing from "../productListing";
export default function SalePage() {
  return (
    <ProductListing
      category="sale"
      title="Sale"
      description="Up to 65% off – limited time"
      saleOnly={true}
    />
  );
}