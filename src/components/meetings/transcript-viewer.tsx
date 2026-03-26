"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { SPEAKER_COLORS } from "@/lib/constants";

interface Segment {
  id: string;
  speakerIndex: number;
  speakerLabel: string | null;
  startTime: number;
  endTime: number;
  text: string;
  confidence: number | null;
}

interface TranscriptViewerProps {
  segments: Segment[];
  currentTime?: number;
  onSeek?: (time: number) => void;
}

function formatTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function TranscriptViewer({
  segments,
  currentTime = 0,
  onSeek,
}: TranscriptViewerProps) {
  const [editingSpeaker, setEditingSpeaker] = useState<string | null>(null);

  if (segments.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-center">
        <p className="text-gray-500">No transcript available yet.</p>
      </div>
    );
  }

  // Group consecutive segments by the same speaker
  const grouped: { speaker: number; label: string | null; segments: Segment[] }[] = [];
  for (const seg of segments) {
    const last = grouped[grouped.length - 1];
    if (last && last.speaker === seg.speakerIndex) {
      last.segments.push(seg);
    } else {
      grouped.push({
        speaker: seg.speakerIndex,
        label: seg.speakerLabel,
        segments: [seg],
      });
    }
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        {grouped.map((group, i) => {
          const firstSeg = group.segments[0];
          const isActive =
            currentTime >= firstSeg.startTime &&
            currentTime <= group.segments[group.segments.length - 1].endTime;

          return (
            <div
              key={i}
              className={`rounded-lg p-3 transition-colors ${
                isActive ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="mb-1.5 flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={
                    SPEAKER_COLORS[group.speaker % SPEAKER_COLORS.length]
                  }
                >
                  {group.label || `Speaker ${group.speaker + 1}`}
                </Badge>
                <button
                  onClick={() => onSeek?.(firstSeg.startTime)}
                  className="text-xs text-gray-400 hover:text-blue-600"
                >
                  {formatTimestamp(firstSeg.startTime)}
                </button>
              </div>
              <p className="text-sm leading-relaxed text-gray-700">
                {group.segments.map((seg) => seg.text).join(" ")}
              </p>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
