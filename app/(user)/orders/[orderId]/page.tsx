import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { OrderDetail } from "./order-detail";
import { notFound } from "next/navigation";

interface OrderPageProps {
  params: {
    orderId: string;
  };
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const order = await prisma.order.findUnique({
    where: {
      id: params.orderId,
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
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Detail Pesanan</h1>
          <p className="text-muted-foreground">
            Order #{params.orderId.slice(-8)}
          </p>
        </div>
        <OrderDetail order={order} />
      </div>
    </div>
  );
}
