import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { meetings, transcripts, summaries } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import {
  generateSummaryStream,
  extractActionItems,
  extractKeyTopics,
} from "@/lib/services/claude";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { meetingId } = await params;

    // Verify ownership
    const meeting = await db.query.meetings.findFirst({
      where: and(eq(meetings.id, meetingId), eq(meetings.userId, userId)),
    });
    if (!meeting) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Get transcript
    const transcript = await db.query.transcripts.findFirst({
      where: eq(transcripts.meetingId, meetingId),
    });
    if (!transcript) {
      return NextResponse.json(
        { error: "No transcript found" },
        { status: 400 }
      );
    }

    // Stream the summary
    const stream = await generateSummaryStream(transcript.fullText);
    let fullContent = "";

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              const text = event.delta.text;
              fullContent += text;
              controller.enqueue(new TextEncoder().encode(text));
            }
          }

          // Save to database after streaming completes
          const finalMessage = await stream.finalMessage();
          const actionItems = extractActionItems(fullContent);
          const keyTopics = extractKeyTopics(fullContent);

          // Delete existing summary if any
          await db
            .delete(summaries)
            .where(eq(summaries.meetingId, meetingId));

          // Insert new summary
          await db.insert(summaries).values({
            meetingId,
            content: fullContent,
            actionItems,
            keyTopics,
            modelUsed: "claude-sonnet-4-20250514",
            promptTokens: finalMessage.usage.input_tokens,
            completionTokens: finalMessage.usage.output_tokens,
          });

          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Failed to generate summary:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}

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

    const summary = await db.query.summaries.findFirst({
      where: eq(summaries.meetingId, meetingId),
    });

    if (!summary) {
      return NextResponse.json({ error: "No summary found" }, { status: 404 });
    }

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Failed to get summary:", error);
    return NextResponse.json(
      { error: "Failed to get summary" },
      { status: 500 }
    );
  }
}
