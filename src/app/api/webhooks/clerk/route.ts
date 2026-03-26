import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  // If no webhook secret, skip verification (development)
  let evt = payload;
  if (webhookSecret) {
    try {
      const wh = new Webhook(webhookSecret);
      evt = wh.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as typeof payload;
    } catch {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  }

  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    const email = email_addresses?.[0]?.email_address;

    if (!email) {
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    await db
      .insert(users)
      .values({
        id,
        email,
        firstName: first_name,
        lastName: last_name,
        imageUrl: image_url,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
          updatedAt: new Date(),
        },
      });
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;
    if (id) {
      await db.delete(users).where(eq(users.id, id));
    }
  }

  return NextResponse.json({ success: true });
}
