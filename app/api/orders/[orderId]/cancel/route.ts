import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the order and verify ownership
    const order = await prisma.order.findUnique({
      where: {
        id: params.orderId,
        userId,
      },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Hanya bisa membatalkan pesanan dengan status PENDING atau PAID
    if (!["PENDING", "PAID"].includes(order.status)) {
      return new NextResponse(
        "Hanya pesanan dengan status PENDING atau PAID yang dapat dibatalkan",
        {
          status: 400,
        }
      );
    }

    // Update order status to CANCELLED
    const updatedOrder = await prisma.order.update({
      where: {
        id: params.orderId,
      },
      data: {
        status: "CANCELLED",
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("[ORDER_CANCEL]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
