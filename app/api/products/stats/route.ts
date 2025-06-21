import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Get total products
    const total = await prisma.product.count();

    // Get products with variants
    const productsWithVariants = await prisma.product.findMany({
      include: {
        variant: true,
      },
    });

    // Calculate low stock and out of stock based on variants
    const lowStock = productsWithVariants.filter((product) =>
      product.variant.some((v) => v.stock > 0 && v.stock < 10)
    ).length;

    const outOfStock = productsWithVariants.filter((product) =>
      product.variant.every((v) => v.stock === 0)
    ).length;

    // Get top selling products
    const topSelling = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 5,
    });

    // Get product details for top selling items
    const topSellingDetails = await Promise.all(
      topSelling.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: {
            id: item.productId,
          },
          select: {
            name: true,
          },
        });
        return {
          name: product?.name,
          quantity: item._sum.quantity,
        };
      })
    );

    return NextResponse.json({
      total,
      lowStock,
      outOfStock,
      topSelling: topSellingDetails,
    });
  } catch (error) {
    console.error("[PRODUCTS_STATS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch product statistics" },
      { status: 500 }
    );
  }
}
