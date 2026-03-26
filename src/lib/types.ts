export type MeetingStatus =
  | "uploading"
  | "transcribing"
  | "summarizing"
  | "completed"
  | "failed";

export type MeetingSource = "upload" | "recording" | "bot";

export type BotStatus =
  | "pending"
  | "joining"
  | "in_meeting"
  | "recording"
  | "processing"
  | "completed"
  | "failed";

export interface ActionItem {
  text: string;
  assignee?: string;
  dueDate?: string;
  completed: boolean;
}

export interface TranscriptSegment {
  id: string;
  speakerIndex: number;
  speakerLabel: string | null;
  startTime: number;
  endTime: number;
  text: string;
  confidence: number | null;
}

export interface MeetingSummary {
  content: string;
  actionItems: ActionItem[];
  keyTopics: string[];
}

export interface SearchResult {
  meetingId: string;
  title: string;
  createdAt: Date;
  headline: string;
  rank: number;
}
