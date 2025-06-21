import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface ProductVariant {
  name: string;
  stock: number;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const categorySlug = searchParams.get("category");
    const sort = searchParams.get("sort") || "relevance";
    const exclude = searchParams.get("exclude");
    const search = searchParams.get("search")?.trim();

    const skip = (page - 1) * limit;

    // Build the where clause based on category filter, exclude, and search
    const where: Prisma.ProductWhereInput = {};

    if (categorySlug) {
      // Find category by slug
      const category = await prisma.category.findFirst({
        where: {
          name: {
            mode: "insensitive",
            in: [
              categorySlug.replace(/-/g, " "), // Convert slug to name
              categorySlug.replace(/-/g, ""), // Without spaces
              categorySlug, // As is
            ],
          },
        },
      });

      if (category) {
        where.categoryId = category.id;
      }
    }

    if (exclude) {
      where.NOT = {
        id: exclude,
      };
    }

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          category: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    // Build the orderBy based on sort parameter and search relevance
    let orderBy: Prisma.ProductOrderByWithRelationInput[] = [
      { createdAt: "desc" },
    ];

    if (search && sort === "relevance") {
      // For relevance sorting with search, prioritize exact matches
      where.OR = [
        {
          name: {
            equals: search,
            mode: "insensitive",
          },
        },
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          category: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ];
      orderBy = [{ createdAt: "desc" }];
    } else {
      switch (sort) {
        case "latest":
          orderBy = [{ createdAt: "desc" }];
          break;
        case "price_desc":
          orderBy = [{ price: "desc" }];
          break;
        case "price_asc":
          orderBy = [{ price: "asc" }];
          break;
        case "trending":
          // For trending, we could add a viewCount or salesCount field later
          orderBy = [{ createdAt: "desc" }];
          break;
        default:
          orderBy = [{ createdAt: "desc" }];
          break;
      }
    }

    // Get total count for pagination
    const total = await prisma.product.count({ where });

    // Fetch products with pagination and sorting
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: {
        variant: true,
        category: true,
      },
      orderBy,
    });

    // Add slug to each product
    const productsWithSlug = products.map((product) => ({
      ...product,
      slug: product.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    }));

    return NextResponse.json({
      products: productsWithSlug,
      hasMore: skip + products.length < total,
      total,
    });
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
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
