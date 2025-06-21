import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Get daily sales for current month
    const dailySales = await prisma.order.groupBy({
      by: ["createdAt"],
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

    // Format data for chart
    const formattedData = dailySales.map((sale) => ({
      date: sale.createdAt.toISOString().split("T")[0],
      amount: sale._sum?.total || 0,
    }));

    // Sort by date
    formattedData.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("[SALES_TREND_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch sales trend data" },
      { status: 500 }
    );
  }
}
