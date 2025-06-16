import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // Check if category with same name exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive", // Case insensitive comparison
        },
      },
    });

    if (existingCategory) {
      return new NextResponse("A category with this name already exists", {
        status: 409, // Conflict status code
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORIES_POST]", error);
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
