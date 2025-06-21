import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PaymentOptions } from "@/app/payment/[orderId]/payment-options";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface PaymentPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { userId } = await auth();
  const { orderId } = await params;
  if (!userId) {
    redirect("/");
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

  // If order is already paid, redirect to order detail
  if (order.status !== "PENDING") {
    redirect(`/orders/${order.id}`);
  }

  return (
    <div className="container max-w-2xl py-8 px-5 mx-auto mt-10">
      <div className="space-y-8">
        <div>
          <Link
            href="/orders"
            className="flex items-center
           gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Pesanan Saya
          </Link>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Pembayaran</h1>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <p className="font-medium">Total Pembayaran</p>
              <p className="text-2xl font-bold">
                Rp {order.total.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-medium">#{order.id.slice(-8)}</p>
            </div>
          </div>

          <PaymentOptions order={order} />
        </div>
      </div>
    </div>
  );
}
