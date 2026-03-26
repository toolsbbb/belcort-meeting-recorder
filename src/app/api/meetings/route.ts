import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { meetings } from "@/lib/db/schema";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, source, audioKey, audioFileSize, audioMimeType } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const audioUrl = audioKey
      ? `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET_NAME}/${audioKey}`
      : null;

    const [meeting] = await db
      .insert(meetings)
      .values({
        userId,
        title,
        description,
        source: source || "upload",
        status: "uploading",
        audioUrl,
        audioFileSize,
        audioMimeType,
      })
      .returning();

    return NextResponse.json(meeting);
  } catch (error) {
    console.error("Failed to create meeting:", error);
    return NextResponse.json(
      { error: "Failed to create meeting" },
      { status: 500 }
    );
  }
}
