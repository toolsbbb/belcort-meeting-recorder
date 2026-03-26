import {
  pgTable,
  text,
  integer,
  timestamp,
  varchar,
  jsonb,
  pgEnum,
  uuid,
  index,
  real,
} from "drizzle-orm/pg-core";
import type { ActionItem } from "@/lib/types";

// ── Enums ──
export const meetingStatusEnum = pgEnum("meeting_status", [
  "uploading",
  "transcribing",
  "summarizing",
  "completed",
  "failed",
]);

export const meetingSourceEnum = pgEnum("meeting_source", [
  "upload",
  "recording",
  "bot",
]);

export const botStatusEnum = pgEnum("bot_status", [
  "pending",
  "joining",
  "in_meeting",
  "recording",
  "processing",
  "completed",
  "failed",
]);

// ── Users (synced from Clerk via webhook) ──
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Meetings ──
export const meetings = pgTable(
  "meetings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 500 }).notNull(),
    description: text("description"),
    status: meetingStatusEnum("status").notNull().default("uploading"),
    source: meetingSourceEnum("source").notNull().default("upload"),
    duration: integer("duration"),
    audioUrl: text("audio_url"),
    audioFileSize: integer("audio_file_size"),
    audioMimeType: varchar("audio_mime_type", { length: 100 }),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("meetings_user_id_idx").on(table.userId),
    index("meetings_status_idx").on(table.status),
    index("meetings_created_at_idx").on(table.createdAt),
  ]
);

// ── Transcripts ──
export const transcripts = pgTable(
  "transcripts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    meetingId: uuid("meeting_id")
      .notNull()
      .references(() => meetings.id, { onDelete: "cascade" }),
    fullText: text("full_text").notNull(),
    wordCount: integer("word_count"),
    language: varchar("language", { length: 10 }).default("en"),
    confidence: real("confidence"),
    deepgramRequestId: text("deepgram_request_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("transcripts_meeting_id_idx").on(table.meetingId)]
);

// ── Transcript Segments ──
export const transcriptSegments = pgTable(
  "transcript_segments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    transcriptId: uuid("transcript_id")
      .notNull()
      .references(() => transcripts.id, { onDelete: "cascade" }),
    speakerIndex: integer("speaker_index").notNull(),
    speakerLabel: varchar("speaker_label", { length: 100 }),
    startTime: real("start_time").notNull(),
    endTime: real("end_time").notNull(),
    text: text("text").notNull(),
    confidence: real("confidence"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("segments_transcript_id_idx").on(table.transcriptId),
    index("segments_speaker_idx").on(table.transcriptId, table.speakerIndex),
  ]
);

// ── AI Summaries ──
export const summaries = pgTable(
  "summaries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    meetingId: uuid("meeting_id")
      .notNull()
      .references(() => meetings.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    actionItems: jsonb("action_items").$type<ActionItem[]>(),
    keyTopics: jsonb("key_topics").$type<string[]>(),
    modelUsed: varchar("model_used", { length: 100 }).default(
      "claude-sonnet-4-20250514"
    ),
    promptTokens: integer("prompt_tokens"),
    completionTokens: integer("completion_tokens"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("summaries_meeting_id_idx").on(table.meetingId)]
);

// ── Meeting Bots (Phase 3) ──
export const meetingBots = pgTable(
  "meeting_bots",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    meetingId: uuid("meeting_id").references(() => meetings.id, {
      onDelete: "set null",
    }),
    recallBotId: text("recall_bot_id").unique(),
    meetingUrl: text("meeting_url").notNull(),
    platform: varchar("platform", { length: 50 }),
    status: botStatusEnum("status").notNull().default("pending"),
    botName: varchar("bot_name", { length: 200 }).default("Belcort Recorder"),
    scheduledAt: timestamp("scheduled_at"),
    joinedAt: timestamp("joined_at"),
    leftAt: timestamp("left_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("bots_user_id_idx").on(table.userId),
    index("bots_recall_bot_id_idx").on(table.recallBotId),
  ]
);
