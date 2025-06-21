import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  const { categoryId } = await params;
  if (!categoryId) {
    return new NextResponse("Category ID is required", { status: 400 });
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId: categoryId,
      },
      include: {
        category: true,
        variant: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[CATEGORY_PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
