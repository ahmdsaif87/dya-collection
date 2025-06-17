import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let products;

    if (category) {
      // Convert URL-friendly category name to display format
      const searchCategory = category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      products = await prisma.product.findMany({
        where: {
          category: {
            name: {
              mode: "insensitive",
              equals: searchCategory,
            },
          },
        },
        include: {
          category: true,
          variant: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      products = await prisma.product.findMany({
        include: {
          category: true,
          variant: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, price, imageUrl, categoryId, variant } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category is required", { status: 400 });
    }

    if (!variant || variant.length === 0) {
      return new NextResponse("At least one variant is required", {
        status: 400,
      });
    }

    // Check if product with same name exists
    const existingProduct = await prisma.product.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (existingProduct) {
      return new NextResponse("A product with this name already exists", {
        status: 409,
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price.toString()),
        imageUrl,
        categoryId,
        variant: {
          create: variant.map((v: { name: string; stock: number }) => ({
            name: v.name,
            stock: v.stock,
          })),
        },
      },
      include: {
        category: true,
        variant: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCTS_POST]", error);
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 });
    }
    return new NextResponse("Internal error", { status: 500 });
  }
}
