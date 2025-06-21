import { RevenueCard } from "@/components/dashboard/revenue-card";
import { OrdersCard } from "@/components/dashboard/orders-card";
import { CustomersCard } from "@/components/dashboard/customers-card";
import { ProductsCard } from "@/components/dashboard/products-card";
import OrdersClient from "../orders/orders-client";
import prisma from "@/lib/prisma";

export default async function Dashboard() {
  const orders = await prisma.order.findMany({
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
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <RevenueCard />
        <OrdersCard />
        <CustomersCard />
        <ProductsCard />
      </div>
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
        <OrdersClient data={orders} />
      </div>
    </div>
  );
}
