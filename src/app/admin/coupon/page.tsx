import { prisma } from "@/lib/prisma";
import AdminCouponsClient from "@/components/admin/AdminCouponsClient";
import { SessionVerify } from "@/app/api/user/verify/route";
import { redirect } from "next/navigation";

export default async function AdminCouponsPage() {
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

  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <AdminCouponsClient initialCoupons={coupons} />;
}