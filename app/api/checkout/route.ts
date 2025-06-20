import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { addressId, items, total } = body;

    if (!addressId || !items || !total) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Create order and order items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const order = await tx.order.create({
        data: {
          userId,
          addressId,
          total,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // Delete cart items
      await tx.cartItem.deleteMany({
        where: {
          userId,
        },
      });

      return order;
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[CHECKOUT_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
