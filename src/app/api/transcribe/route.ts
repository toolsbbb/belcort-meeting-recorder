import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { meetings, transcripts, transcriptSegments } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { transcribeAudioUrl } from "@/lib/services/deepgram";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { meetingId } = await req.json();
    if (!meetingId) {
      return NextResponse.json(
        { error: "meetingId is required" },
        { status: 400 }
      );
    }

    // Get the meeting
    const meeting = await db.query.meetings.findFirst({
      where: and(eq(meetings.id, meetingId), eq(meetings.userId, userId)),
    });

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    if (!meeting.audioUrl) {
      return NextResponse.json(
        { error: "No audio URL found" },
        { status: 400 }
      );
    }

    // Update status to transcribing
    await db
      .update(meetings)
      .set({ status: "transcribing", updatedAt: new Date() })
      .where(eq(meetings.id, meetingId));

    // Start transcription (async - runs in background)
    transcribeAndSave(meetingId, meeting.audioUrl).catch((error) => {
      console.error("Transcription failed:", error);
      db.update(meetings)
        .set({ status: "failed", updatedAt: new Date() })
        .where(eq(meetings.id, meetingId))
        .then(() => {});
    });

    return NextResponse.json({ status: "transcribing", meetingId });
  } catch (error) {
    console.error("Failed to start transcription:", error);
    return NextResponse.json(
      { error: "Failed to start transcription" },
      { status: 500 }
    );
  }
}

async function transcribeAndSave(meetingId: string, audioUrl: string) {
  // Call Deepgram
  const result = await transcribeAudioUrl(audioUrl);

  // Save transcript
  const [transcript] = await db
    .insert(transcripts)
    .values({
      meetingId,
      fullText: result.fullText,
      wordCount: result.wordCount,
      language: result.language,
      confidence: result.confidence,
    })
    .returning();

  // Save segments
  if (result.segments.length > 0) {
    await db.insert(transcriptSegments).values(
      result.segments.map((seg) => ({
        transcriptId: transcript.id,
        speakerIndex: seg.speakerIndex,
        startTime: seg.startTime,
        endTime: seg.endTime,
        text: seg.text,
        confidence: seg.confidence,
      }))
    );
  }

  // Calculate duration from last segment
  const lastSegment = result.segments[result.segments.length - 1];
  const duration = lastSegment ? Math.ceil(lastSegment.endTime) : null;

  // Update meeting status
  await db
    .update(meetings)
    .set({
      status: "completed",
      duration,
      updatedAt: new Date(),
    })
    .where(eq(meetings.id, meetingId));
}
