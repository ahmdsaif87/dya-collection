import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { categoryId: string } }
) {
  if (!params?.categoryId) {
    return new NextResponse("Category ID is required", { status: 400 });
  }

  const categoryId = params.categoryId;

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
