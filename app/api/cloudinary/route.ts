import { cloudinary } from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folder = searchParams.get("folder") || "dyaimage";

  try {
    const result = await cloudinary.search
      .expression(`folder:${folder}/*`)
      .sort_by("public_id", "desc")
      .max_results(30)
      .execute();

    return NextResponse.json(result);
  } catch (err) {
    console.error("[Cloudinary fetch error]", err);
    return new NextResponse("Failed to fetch images", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { folder = "dyaimage" } = body;

    const result = await cloudinary.search
      .expression(`folder:${folder}/*`)
      .sort_by("public_id", "desc")
      .max_results(30)
      .execute();

    return NextResponse.json(result);
  } catch (err) {
    console.error("[Cloudinary search error]", err);
    return new NextResponse("Failed to search images", { status: 500 });
  }
}
