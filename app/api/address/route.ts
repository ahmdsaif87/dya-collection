import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error("[ADDRESS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, phone, street, city, province, postalCode, country } = body;

    if (
      !name ||
      !phone ||
      !street ||
      !city ||
      !province ||
      !postalCode ||
      !country
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        name,
        phone,
        street,
        city,
        province,
        postalCode,
        country,
      },
    });

    return NextResponse.json(address);
  } catch (error) {
    console.error("[ADDRESS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
