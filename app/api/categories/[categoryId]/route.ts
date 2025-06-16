import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
    }

    const category = await prisma.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: {
        products: true,
      },
    });

    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // Check if another category with same name exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        NOT: {
          id: params.categoryId,
        },
      },
    });

    if (existingCategory) {
      return new NextResponse("A category with this name already exists", {
        status: 409,
      });
    }

    const category = await prisma.category.update({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_PATCH]", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return new NextResponse("A category with this name already exists", {
          status: 409,
        });
      }
    }
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const category = await prisma.category.delete({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
