import {  NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface ProductVariant {
  name: string;
  stock: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : 12;
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page")!)
      : 1;
    const sort = searchParams.get("sort") || undefined;
    const category = searchParams.get("category") || undefined;
    const exclude = searchParams.get("exclude") || undefined;

    // Build where clause
    const where: Prisma.ProductWhereInput = {};
    if (category) {
      // Try to find by category ID first
      const categoryById = await prisma.category.findUnique({
        where: { id: category },
      });

      if (categoryById) {
        where.categoryId = category;
      } else {
        // If not found by ID, try to find by name/slug
        where.category = {
          name: {
            equals: category.replace(/-/g, " "),
            mode: "insensitive",
          },
        };
      }
    }
    if (exclude) {
      where.id = {
        not: exclude,
      };
    }

    // Get total count
    const total = await prisma.product.count({ where });

    // Get products
    const products = await prisma.product.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy:
        sort === "relevance"
          ? undefined
          : sort === "price_asc"
          ? { price: "asc" }
          : sort === "price_desc"
          ? { price: "desc" }
          : { createdAt: "desc" },
      where,
      include: {
        category: true,
        variant: true,
      },
    });

    return NextResponse.json({
      products,
      hasMore: page * limit < total,
      total,
    });
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
          create: variant.map((v: ProductVariant) => ({
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
