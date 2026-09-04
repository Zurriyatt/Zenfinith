export interface Product {
  id: string;
  name: string;
  price: number;
  description:string;
  oldPrice?: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  badge: string;
  totalDiscount:number;
  isInCart? : boolean;
  isLiked? : boolean;
  qtyInCart? : number;
  category: "new-arrivals" | "men" | "women" | "accessories" | "sale" | "best-products";
}

