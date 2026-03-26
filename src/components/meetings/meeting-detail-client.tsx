"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TranscriptViewer } from "./transcript-viewer";
import { SummaryPanel } from "./summary-panel";
import { AudioPlayer } from "./audio-player";
import { FileText, Sparkles } from "lucide-react";

interface MeetingDetailClientProps {
  meetingId: string;
  audioUrl: string | null;
  transcript: {
    id: string;
    fullText: string;
    wordCount: number | null;
    segments: {
      id: string;
      speakerIndex: number;
      speakerLabel: string | null;
      startTime: number;
      endTime: number;
      text: string;
      confidence: number | null;
    }[];
  } | null;
  summary: {
    id: string;
    content: string;
    keyTopics: string[] | null;
    actionItems: { text: string; assignee?: string; completed: boolean }[] | null;
  } | null;
}

export function MeetingDetailClient({
  meetingId,
  audioUrl,
  transcript,
  summary,
}: MeetingDetailClientProps) {
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <div className="space-y-6">
      {/* Audio Player */}
      {audioUrl && (
        <AudioPlayer audioUrl={audioUrl} onTimeUpdate={setCurrentTime} />
      )}

      {/* Two column layout */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Transcript */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Transcript
                {transcript?.wordCount && (
                  <span className="text-sm font-normal text-gray-400">
                    ({transcript.wordCount.toLocaleString()} words)
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TranscriptViewer
                segments={transcript?.segments || []}
                currentTime={currentTime}
              />
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SummaryPanel
                meetingId={meetingId}
                summary={summary}
                hasTranscript={!!transcript}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
