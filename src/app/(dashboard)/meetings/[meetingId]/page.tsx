import { getMeeting } from "@/lib/actions/meetings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TranscriptViewer } from "@/components/meetings/transcript-viewer";
import { SummaryPanel } from "@/components/meetings/summary-panel";
import { AudioPlayer } from "@/components/meetings/audio-player";
import { ArrowLeft, Clock, Calendar, FileAudio } from "lucide-react";
import { MEETING_STATUSES } from "@/lib/constants";
import { format } from "date-fns";
import Link from "next/link";
import { MeetingDetailClient } from "@/components/meetings/meeting-detail-client";

interface Props {
  params: Promise<{ meetingId: string }>;
}

export default async function MeetingDetailPage({ params }: Props) {
  const { meetingId } = await params;
  const meeting = await getMeeting(meetingId);

  const statusColors: Record<string, string> = {
    uploading: "bg-yellow-100 text-yellow-800",
    transcribing: "bg-blue-100 text-blue-800",
    summarizing: "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link href="/meetings">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {meeting.title}
            </h1>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(meeting.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </span>
              {meeting.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {Math.floor(meeting.duration / 60)}m {meeting.duration % 60}s
                </span>
              )}
              <Badge
                variant="secondary"
                className={statusColors[meeting.status]}
              >
                {MEETING_STATUSES[meeting.status as keyof typeof MEETING_STATUSES]}
              </Badge>
            </div>
            {meeting.description && (
              <p className="mt-2 text-sm text-gray-600">
                {meeting.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Status message for in-progress meetings */}
      {(meeting.status === "uploading" || meeting.status === "transcribing") && (
        <Card>
          <CardContent className="flex items-center gap-3 py-6">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <p className="text-sm text-gray-600">
              {meeting.status === "uploading"
                ? "Your meeting file is being processed..."
                : "Transcription is in progress. This usually takes 1-5 minutes..."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Main content */}
      <MeetingDetailClient
        meetingId={meeting.id}
        audioUrl={meeting.audioUrl}
        transcript={meeting.transcript}
        summary={meeting.summary}
      />
    </div>
  );
}
