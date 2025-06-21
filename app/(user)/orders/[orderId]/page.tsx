import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { OrderDetail } from "@/app/(user)/orders/[orderId]/order-detail";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface OrderPageProps {
  params: {
    orderId: string;
  };
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { userId } = await auth();
  const { orderId } = await params;

  if (!userId) {
    redirect("/sign-in");
  }

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
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
    <div className="container max-w-4xl py-8 px-5 mx-auto mt-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/orders">Pesanan Saya</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <p className="text-sm text-muted-foreground">Rincian Pesanan</p>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="space-y-8 mt-5">
        <OrderDetail order={order} />
      </div>
    </div>
  );
}
