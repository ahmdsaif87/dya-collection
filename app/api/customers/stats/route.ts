import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    // Get total customers
    const total = await prisma.user.count();

    // Get new customers this month
    const newThisMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    // Get new customers last month
    const newLastMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: startOfLastMonth,
          lt: endOfLastMonth,
        },
      },
    });

    // Calculate growth percentage
    const growthPercentage =
      newLastMonth === 0
        ? 100
        : ((newThisMonth - newLastMonth) / newLastMonth) * 100;

    // Get active customers (made at least one order this month)
    const activeCustomers = await prisma.order
      .groupBy({
        by: ["userId"],
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
      })
      .then((orders) => orders.length);

    return NextResponse.json({
      total,
      newThisMonth,
      activeCustomers,
      growthPercentage: Math.round(growthPercentage * 100) / 100,
    });
  } catch (error) {
    console.error("[CUSTOMERS_STATS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch customer statistics" },
      { status: 500 }
    );
  }
}
