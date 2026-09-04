import { prisma } from "@/lib/prisma";
import AdminOrdersClient from "@/components/admin/AdminOrdersClient";
import { SessionVerify } from "@/app/api/user/verify/route";
import { redirect } from "next/navigation";

export default async function AdminOrdersPage() {
  const session = await SessionVerify();
  if (!session.success || !session.user.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    redirect("/");
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      user: {
        select: { name: true, email: true },
      },
    },
  });

  // Map to plain objects (no Date objects for client)
  const initialOrders = orders.map((order) => ({
    id: order.id,
    user: {
      name: order.user.name,
      email: order.user.email,
    },
    email: order.email,
    status: order.status,
    subtotal: order.subtotal,
    discount: order.discount,
    total: order.total,
    couponCode: order.couponCode,
    address: order.address,
    city: order.city,
    phone: order.phone,
    country: order.country,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    })),
  }));

  return <AdminOrdersClient initialOrders={initialOrders} />;
}