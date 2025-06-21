import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const startOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    // Get today's revenue
    const todayRevenue = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: startOfToday,
        },
        status: "COMPLETED",
      },
      _sum: {
        total: true,
      },
    });

    // Get this month's revenue
    const monthRevenue = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
        status: "COMPLETED",
      },
      _sum: {
        total: true,
      },
    });

    // Get this year's revenue
    const yearRevenue = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: startOfYear,
        },
        status: "COMPLETED",
      },
      _sum: {
        total: true,
      },
    });

    // Get last month's revenue for comparison
    const lastMonthRevenue = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: startOfLastMonth,
          lt: endOfLastMonth,
        },
        status: "COMPLETED",
      },
      _sum: {
        total: true,
      },
    });

    // Calculate percentage change
    const currentMonthRevenue = monthRevenue._sum.total || 0;
    const previousMonthRevenue = lastMonthRevenue._sum.total || 0;
    const percentageChange =
      previousMonthRevenue === 0
        ? 100
        : ((currentMonthRevenue - previousMonthRevenue) /
            previousMonthRevenue) *
          100;

    return NextResponse.json({
      today: todayRevenue._sum.total || 0,
      thisMonth: monthRevenue._sum.total || 0,
      thisYear: yearRevenue._sum.total || 0,
      percentageChange: Math.round(percentageChange * 100) / 100,
    });
  } catch (error) {
    console.error("[REVENUE_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch revenue data" },
      { status: 500 }
    );
  }
}
