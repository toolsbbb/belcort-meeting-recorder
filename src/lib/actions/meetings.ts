"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { meetings, transcripts, transcriptSegments, summaries } from "@/lib/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createMeeting(data: {
  title: string;
  description?: string;
  source?: "upload" | "recording" | "bot";
  audioUrl?: string;
  audioFileSize?: number;
  audioMimeType?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [meeting] = await db
    .insert(meetings)
    .values({
      userId,
      title: data.title,
      description: data.description,
      source: data.source || "upload",
      status: "uploading",
      audioUrl: data.audioUrl,
      audioFileSize: data.audioFileSize,
      audioMimeType: data.audioMimeType,
    })
    .returning();

  revalidatePath("/meetings");
  revalidatePath("/dashboard");
  return meeting;
}

export async function getMeetings(page = 1, limit = 20) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const offset = (page - 1) * limit;

  const results = await db.query.meetings.findMany({
    where: eq(meetings.userId, userId),
    orderBy: desc(meetings.createdAt),
    limit,
    offset,
    with: {
      transcript: {
        columns: { id: true, wordCount: true },
      },
      summary: {
        columns: { id: true },
      },
    },
  });

  const [countResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(meetings)
    .where(eq(meetings.userId, userId));

  return {
    meetings: results,
    total: Number(countResult.count),
    page,
    totalPages: Math.ceil(Number(countResult.count) / limit),
  };
}

export async function getMeeting(meetingId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

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

  if (!meeting) throw new Error("Meeting not found");
  return meeting;
}

export async function updateMeeting(
  meetingId: string,
  data: {
    title?: string;
    description?: string;
    status?: "uploading" | "transcribing" | "summarizing" | "completed" | "failed";
    duration?: number;
    audioUrl?: string;
  }
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [updated] = await db
    .update(meetings)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(meetings.id, meetingId), eq(meetings.userId, userId)))
    .returning();

  revalidatePath(`/meetings/${meetingId}`);
  revalidatePath("/meetings");
  return updated;
}

export async function deleteMeeting(meetingId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db
    .delete(meetings)
    .where(and(eq(meetings.id, meetingId), eq(meetings.userId, userId)));

  revalidatePath("/meetings");
  revalidatePath("/dashboard");
}

export async function updateSpeakerLabel(
  segmentId: string,
  label: string
) {
  await db
    .update(transcriptSegments)
    .set({ speakerLabel: label, updatedAt: new Date() })
    .where(eq(transcriptSegments.id, segmentId));
}
