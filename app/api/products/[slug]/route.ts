import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Helper function to generate slug from product name
function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        { error: "Product ID or slug is required" },
        { status: 400 }
      );
    }

    // Check if the request is from admin (contains /admin in the path)
    const isAdminRequest = request.url.includes("/admin/");

    // For admin requests, only try ID lookup
    if (isAdminRequest) {
      const product = await prisma.product.findUnique({
        where: {
          id: slug,
        },
        include: {
          variant: true,
          category: true,
        },
      });

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(product);
    }

    // For user-facing requests, try both ID and slug
    let product = await prisma.product.findUnique({
      where: {
        id: slug,
      },
      include: {
        variant: true,
        category: true,
      },
    });

    // If not found by ID, try to find by slug
    if (!product) {
      product = await prisma.product.findFirst({
        where: {
          name: {
            mode: "insensitive",
            in: [
              slug.replace(/-/g, " "), // Convert slug to name
              slug.replace(/-/g, ""), // Without spaces
              slug, // As is
            ],
          },
        },
        include: {
          variant: true,
          category: true,
        },
      });
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Add the slug to the response for user-facing requests
    return NextResponse.json({
      ...product,
      slug: generateSlug(product.name),
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const body = await request.json();
    const { name, description, price, imageUrl, categoryId, variant } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category is required", { status: 400 });
    }

    if (!variant || variant.length === 0) {
      return new NextResponse("At least one variant is required", {
        status: 400,
      });
    }

    // For admin routes, only look up by ID
    const existingProduct = await prisma.product.findUnique({
      where: {
        id: slug,
      },
    });

    if (!existingProduct) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Check if another product with same name exists
    const duplicateProduct = await prisma.product.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        NOT: {
          id: existingProduct.id,
        },
      },
    });

    if (duplicateProduct) {
      return new NextResponse("A product with this name already exists", {
        status: 409,
      });
    }

    // Get existing variants to delete cart items
    const existingVariants = await prisma.productVariant.findMany({
      where: {
        productId: existingProduct.id,
      },
      select: {
        id: true,
      },
    });

    // Delete cart items referencing these variants
    if (existingVariants.length > 0) {
      await prisma.cartItem.deleteMany({
        where: {
          productVariantId: {
            in: existingVariants.map((v) => v.id),
          },
        },
      });
    }

    // Now safe to delete variants
    await prisma.productVariant.deleteMany({
      where: {
        productId: existingProduct.id,
      },
    });

    // Then update the product with new variants
    const product = await prisma.product.update({
      where: {
        id: existingProduct.id,
      },
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
    console.error("[PRODUCT_PATCH]", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return new NextResponse("A product with this name already exists", {
          status: 409,
        });
      }
      if (error.code === "P2003") {
        return new NextResponse(
          "Cannot delete variants that are in active carts",
          {
            status: 400,
          }
        );
      }
    }
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    // For admin routes, only look up by ID
    const product = await prisma.product.findUnique({
      where: {
        id: slug,
      },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Get existing variants to delete cart items
    const existingVariants = await prisma.productVariant.findMany({
      where: {
        productId: product.id,
      },
      select: {
        id: true,
      },
    });

    // Delete cart items referencing these variants
    if (existingVariants.length > 0) {
      await prisma.cartItem.deleteMany({
        where: {
          productVariantId: {
            in: existingVariants.map((v) => v.id),
          },
        },
      });
    }

    // Now safe to delete variants
    await prisma.productVariant.deleteMany({
      where: {
        productId: product.id,
      },
    });

    // Then delete the product
    const deletedProduct = await prisma.product.delete({
      where: {
        id: product.id,
      },
    });

    return NextResponse.json(deletedProduct);
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return new NextResponse(
          "Cannot delete product with items in active carts",
          {
            status: 400,
          }
        );
      }
    }
    return new NextResponse("Internal error", { status: 500 });
  }
}
