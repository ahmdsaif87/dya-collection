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
      // Check stock availability for all items
      for (const item of items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.productVariantId },
        });

        if (!variant || variant.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for ${item.product.name} - ${item.productVariant.name}`
          );
        }
      }

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

      // Update stock for each product variant
      for (const item of items) {
        await tx.productVariant.update({
          where: { id: item.productVariantId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

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
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    );
  }
}
