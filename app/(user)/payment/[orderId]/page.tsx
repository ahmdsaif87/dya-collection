import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PaymentOptions } from "@/app/(user)/payment/[orderId]/payment-options";

interface PaymentPageProps {
  params: {
    orderId: string;
  };
}

export default async function PaymentPage({ params }: PaymentPageProps) {
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

  // If order is already paid, redirect to order detail
  if (order.status !== "PENDING") {
    redirect(`/orders/${order.id}`);
  }

  return (
    <div className="container max-w-2xl py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Pembayaran</h1>
          <p className="text-muted-foreground">
            Pilih metode pembayaran untuk pesanan #{params.orderId.slice(-8)}
          </p>
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
              <p className="font-medium">#{params.orderId.slice(-8)}</p>
            </div>
          </div>

          <PaymentOptions order={order} />
        </div>
      </div>
    </div>
  );
}
