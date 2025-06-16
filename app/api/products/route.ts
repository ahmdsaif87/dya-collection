import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
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
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return new NextResponse("A product with this name already exists", {
          status: 409,
        });
      }
    }
    return new NextResponse("Internal error", { status: 500 });
  }
}
