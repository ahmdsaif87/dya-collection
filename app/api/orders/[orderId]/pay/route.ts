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

    if (order.status !== "PENDING") {
      return new NextResponse("Order is not pending", { status: 400 });
    }

    // Update order status to PAID
    const updatedOrder = await prisma.order.update({
      where: {
        id: params.orderId,
      },
      data: {
        status: "PAID",
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("[ORDER_PAY]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
