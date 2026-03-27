import { getMeeting } from "@/lib/actions/meetings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { MEETING_STATUSES } from "@/lib/constants";
import { format } from "date-fns";
import Link from "next/link";
import { MeetingDetailClient } from "@/components/meetings/meeting-detail-client";

interface Props {
  params: Promise<{ meetingId: string }>;
}

const statusColors: Record<string, string> = {
  uploading: "bg-yellow-100 text-yellow-800",
  transcribing: "bg-blue-100 text-blue-800",
  summarizing: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

export default async function MeetingDetailPage({ params }: Props) {
  const { meetingId } = await params;
  const meeting = await getMeeting(meetingId);

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <Link href="/meetings">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-lg font-semibold text-gray-900">
              {meeting.title}
            </h1>
            <Badge
              variant="secondary"
              className={statusColors[meeting.status]}
            >
              {MEETING_STATUSES[meeting.status as keyof typeof MEETING_STATUSES]}
            </Badge>
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(meeting.createdAt), "MMM d, yyyy h:mm a")}
            </span>
            {meeting.duration && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {Math.floor(meeting.duration / 60)}m {meeting.duration % 60}s
              </span>
            )}
          </div>
        </div>
      </div>

      {(meeting.status === "uploading" || meeting.status === "transcribing") && (
        <div className="flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm text-gray-600">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          {meeting.status === "uploading"
            ? "Processing..."
            : "Transcribing... usually 1-5 minutes."}
        </div>
      )}

      <MeetingDetailClient
        meetingId={meeting.id}
        audioUrl={meeting.audioUrl}
        transcript={meeting.transcript}
        summary={meeting.summary}
      />
    </div>
  );
}
