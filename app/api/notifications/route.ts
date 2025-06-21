import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const orderStats = await prisma.order.groupBy({
      by: ["status"],
      _count: true,
      orderBy: {
        status: "asc",
      },
    });

    return NextResponse.json(orderStats);
  } catch (error) {
    console.error("[NOTIFICATIONS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch order statistics" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId, addressId, total } = await req.json();

    const order = await prisma.order.create({
      data: {
        status: "PENDING",
        total,
        user: {
          connect: { id: userId },
        },
        address: {
          connect: { id: addressId },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[NOTIFICATIONS_POST]", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();

    const order = await prisma.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[NOTIFICATIONS_PATCH]", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
