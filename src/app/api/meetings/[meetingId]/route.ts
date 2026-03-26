import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { meetings } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { meetingId } = await params;

    const meeting = await db.query.meetings.findFirst({
      where: and(eq(meetings.id, meetingId), eq(meetings.userId, userId)),
      with: {
        transcript: {
          with: {
            segments: {
              orderBy: (segments, { asc }) => [asc(segments.startTime)],
            },
          },
        },
        summary: true,
      },
    });

    if (!meeting) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(meeting);
  } catch (error) {
    console.error("Failed to get meeting:", error);
    return NextResponse.json(
      { error: "Failed to get meeting" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { meetingId } = await params;
    const body = await req.json();

    const [updated] = await db
      .update(meetings)
      .set({ ...body, updatedAt: new Date() })
      .where(and(eq(meetings.id, meetingId), eq(meetings.userId, userId)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update meeting:", error);
    return NextResponse.json(
      { error: "Failed to update meeting" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { meetingId } = await params;

    await db
      .delete(meetings)
      .where(and(eq(meetings.id, meetingId), eq(meetings.userId, userId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete meeting:", error);
    return NextResponse.json(
      { error: "Failed to delete meeting" },
      { status: 500 }
    );
  }
}
