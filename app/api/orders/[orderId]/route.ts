import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { userId } = await auth();
    const { orderId } = await params;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Delete order and related items
    const deletedOrder = await prisma.order.delete({
      where: {
        id: orderId,
      },
    });

    return NextResponse.json(deletedOrder);
  } catch (error) {
    console.error("[ORDER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
