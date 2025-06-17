import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

// Get cart items
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId,
      },
      include: {
        product: {
          include: {
            variant: true,
          },
        },
        productVariant: true,
      },
    });

    return NextResponse.json(cartItems);
  } catch (error) {
    console.error("[CART_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// Add item to cart
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { productId, productVariantId, quantity } = body;

    if (!productId || !productVariantId) {
      return new NextResponse("Product ID and variant ID are required", {
        status: 400,
      });
    }

    // Check if product and variant exist
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        variant: {
          where: { id: productVariantId },
        },
      },
    });

    if (!product || product.variant.length === 0) {
      return new NextResponse("Product or variant not found", { status: 404 });
    }

    // Check stock
    const variant = product.variant[0];
    if (variant.stock < quantity) {
      return new NextResponse("Not enough stock", { status: 400 });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
        productVariantId,
      },
    });

    if (existingItem) {
      // Update quantity if item exists
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: {
          product: {
            include: {
              variant: true,
            },
          },
          productVariant: true,
        },
      });
      return NextResponse.json(updatedItem);
    }

    // Create new cart item
    const cartItem = await prisma.cartItem.create({
      data: {
        userId,
        productId,
        productVariantId,
        quantity,
      },
      include: {
        product: {
          include: {
            variant: true,
          },
        },
        productVariant: true,
      },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error("[CART_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// Update cart item quantity
export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { id, quantity } = body;

    if (!id) {
      return new NextResponse("Cart item ID is required", { status: 400 });
    }

    // Check if cart item exists and belongs to user
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        productVariant: true,
      },
    });

    if (!existingItem) {
      return new NextResponse("Cart item not found", { status: 404 });
    }

    // Check stock
    if (existingItem.productVariant.stock < quantity) {
      return new NextResponse("Not enough stock", { status: 400 });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: {
        product: {
          include: {
            variant: true,
          },
        },
        productVariant: true,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("[CART_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// Delete cart item
export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!id) {
      return new NextResponse("Cart item ID is required", { status: 400 });
    }

    // Check if cart item exists and belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!cartItem) {
      return new NextResponse("Cart item not found", { status: 404 });
    }

    await prisma.cartItem.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("[CART_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
