import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Get total orders
    const total = await prisma.order.count();

    // Get orders by status
    const [pending, paid, completed] = await Promise.all([
      prisma.order.count({
        where: {
          status: "PENDING",
        },
      }),
      prisma.order.count({
        where: {
          status: "PAID",
        },
      }),
      prisma.order.count({
        where: {
          status: "COMPLETED",
        },
      }),
    ]);

    return NextResponse.json({
      total,
      pending,
      paid,
      completed,
    });
  } catch (error) {
    console.error("[ORDERS_STATS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch order statistics" },
      { status: 500 }
    );
  }
}
