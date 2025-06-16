import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// Get cart items
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Ensure user exists
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId },
    });

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            variant: true,
          },
        },
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
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Ensure user exists
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId },
    });

    // Check if item already in cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingCartItem) {
      // Update quantity
      const updatedCartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
        include: {
          product: {
            include: {
              variant: true,
            },
          },
        },
      });
      return NextResponse.json(updatedCartItem);
    }

    // Create new cart item
    const cartItem = await prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity,
      },
      include: {
        product: {
          include: {
            variant: true,
          },
        },
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

    if (quantity < 0) {
      return new NextResponse("Quantity must be positive", { status: 400 });
    }

    // Ensure user exists
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId },
    });

    const cartItem = await prisma.cartItem.update({
      where: {
        id,
        userId,
      },
      data: {
        quantity,
      },
      include: {
        product: {
          include: {
            variant: true,
          },
        },
      },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error("[CART_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// Delete cart item
export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("Cart item ID is required", { status: 400 });
    }

    // Ensure user exists
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId },
    });

    await prisma.cartItem.delete({
      where: {
        id,
        userId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[CART_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
