import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const evt: WebhookEvent = await req.json();

  if (evt.type === "user.created") {
    const userId = evt.data.id;

    await (
      await clerkClient()
    ).users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "admin",
      },
    });
  }

  return NextResponse.json({ success: true });
}
