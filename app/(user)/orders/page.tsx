import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { OrderList } from "@/app/(user)/orders/order-list";

export default async function OrdersPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const orders = await prisma.order.findMany({
    where: {
      userId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      address: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container max-w-4xl py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Pesanan Saya</h1>
          <p className="text-muted-foreground">
            Lihat status dan riwayat pesanan Anda
          </p>
        </div>
        <OrderList orders={orders} />
      </div>
    </div>
  );
}
