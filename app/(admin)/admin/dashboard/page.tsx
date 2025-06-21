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
    <div className="flex-1 space-y-4  pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
        <div className="flex flex-col gap-4">
          <RevenueCard />
          <CustomersCard />
        </div>
        <OrdersCard />
        <ProductsCard />
      </div>
      <div className="flex flex-col">
        <h2 className="text-xl font-medium tracking-tight pb-4">Orderan</h2>
        <OrdersClient data={orders} />
      </div>
    </div>
  );
}
