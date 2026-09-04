import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminProductsClient from "@/components/admin/AdminProductsClient";
import { SessionVerify } from "@/app/api/user/verify/route";
import { Product } from "@/lib/products";
export default async function AdminProductsPage() {
  // 1. Get session and check role
  const session = await SessionVerify();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    // Not authorized – show 403 or redirect
    redirect("/");
  }

  // 2. Fetch products server-side (for display / initial data)
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  const adminProducts: Product[] = products.map((p) => ({
  id: p.id,
  name: p.name,
  price: p.price,
  description:p.description,
  oldPrice: p.oldPrice ?? undefined,   // optional
  rating: p.rating ?? 0,
  reviewsCount: p.reviewsCount ?? 0,
  images: p.images,                    // already string[]
  badge: p.badge,                      // still string; can be optional in interface
  totalDiscount: p.totalDiscount ?? 0,
  category: p.category as Product["category"],  // cast to union
}));

return <AdminProductsClient initialProducts={adminProducts} />;

}