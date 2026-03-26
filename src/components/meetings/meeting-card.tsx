"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { FileAudio, Mic, Bot, Clock, FileText, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MEETING_STATUSES } from "@/lib/constants";
import type { MeetingStatus, MeetingSource } from "@/lib/types";

const sourceIcons: Record<MeetingSource, typeof FileAudio> = {
  upload: FileAudio,
  recording: Mic,
  bot: Bot,
};

const statusColors: Record<MeetingStatus, string> = {
  uploading: "bg-yellow-100 text-yellow-800",
  transcribing: "bg-blue-100 text-blue-800",
  summarizing: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

interface MeetingCardProps {
  meeting: {
    id: string;
    title: string;
    status: MeetingStatus;
    source: MeetingSource;
    duration: number | null;
    createdAt: Date;
    transcript?: { id: string; wordCount: number | null } | null;
    summary?: { id: string } | null;
  };
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function MeetingCard({ meeting }: MeetingCardProps) {
  const SourceIcon = sourceIcons[meeting.source];

  return (
    <Link href={`/meetings/${meeting.id}`}>
      <Card className="transition-shadow hover:shadow-md cursor-pointer">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
            <SourceIcon className="h-5 w-5 text-blue-600" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate font-medium text-gray-900">
              {meeting.title}
            </h3>
            <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
              <span>
                {formatDistanceToNow(new Date(meeting.createdAt), {
                  addSuffix: true,
                })}
              </span>
              {meeting.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDuration(meeting.duration)}
                </span>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {meeting.transcript && (
              <FileText className="h-4 w-4 text-green-500" />
            )}
            {meeting.summary && (
              <Sparkles className="h-4 w-4 text-purple-500" />
            )}
            <Badge
              variant="secondary"
              className={statusColors[meeting.status]}
            >
              {MEETING_STATUSES[meeting.status]}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
