import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Validation schemas
const cartItemSchema = z.object({
  productId: z.string().min(1),
  productVariantId: z.string().min(1),
  quantity: z.number().min(1),
});

const updateCartItemSchema = z.object({
  id: z.string().min(1),
  quantity: z.number().min(1),
});

// Helper function to validate user and ensure they exist in the database
async function validateAndGetUser() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user?.emailAddresses?.[0]?.emailAddress) {
    throw new Error("Unauthorized");
  }

  // Ensure user exists in our database
  const dbUser = await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return dbUser.id;
}

// Helper function to handle API errors
function handleApiError(error: unknown) {
  console.error("[API_ERROR]", error);
  if (error instanceof z.ZodError) {
    return new NextResponse("Invalid request data", { status: 400 });
  }
  if (error instanceof Error) {
    return new NextResponse(error.message, { status: 400 });
  }
  return new NextResponse("Internal Server Error", { status: 500 });
}

// Get cart items
export async function GET() {
  try {
    const userId = await validateAndGetUser();

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
        productVariant: true,
      },
    });

    return NextResponse.json(cartItems);
  } catch (error) {
    return handleApiError(error);
  }
}

// Add item to cart
export async function POST(req: Request) {
  try {
    const userId = await validateAndGetUser();
    const body = await req.json();
    const validatedData = cartItemSchema.parse(body);

    // Check if product and variant exist and has enough stock
    const variant = await prisma.productVariant.findUnique({
      where: { id: validatedData.productVariantId },
    });

    if (!variant || variant.stock < validatedData.quantity) {
      return new NextResponse("Product unavailable or insufficient stock", {
        status: 400,
      });
    }

    // Check for existing cart item
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId: validatedData.productId,
        productVariantId: validatedData.productVariantId,
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + validatedData.quantity;
      if (variant.stock < newQuantity) {
        return new NextResponse("Insufficient stock for requested quantity", {
          status: 400,
        });
      }

      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: {
          product: true,
          productVariant: true,
        },
      });
      return NextResponse.json(updatedItem);
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        userId,
        productId: validatedData.productId,
        productVariantId: validatedData.productVariantId,
        quantity: validatedData.quantity,
      },
      include: {
        product: true,
        productVariant: true,
      },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    return handleApiError(error);
  }
}

// Update cart item quantity
export async function PUT(req: Request) {
  try {
    const userId = await validateAndGetUser();
    const body = await req.json();
    const validatedData = updateCartItemSchema.parse(body);

    // Check if cart item exists and belongs to user
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id: validatedData.id,
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
    if (existingItem.productVariant.stock < validatedData.quantity) {
      return new NextResponse("Insufficient stock", { status: 400 });
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        id: existingItem.id, // Use the real ID from the database
      },
      data: { quantity: validatedData.quantity },
      include: {
        product: true,
        productVariant: true,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    return handleApiError(error);
  }
}

// Delete cart item
export async function DELETE(req: Request) {
  try {
    const userId = await validateAndGetUser();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("Cart item ID required", { status: 400 });
    }

    // If it's a temporary ID, just return success since it doesn't exist in DB
    if (id.startsWith("temp-")) {
      return new NextResponse(null, { status: 200 });
    }

    // Check if item exists and belongs to user
    const item = await prisma.cartItem.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!item) {
      return new NextResponse("Cart item not found", { status: 404 });
    }

    await prisma.cartItem.delete({
      where: {
        id: item.id, // Use the real ID from the database
      },
    });

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
