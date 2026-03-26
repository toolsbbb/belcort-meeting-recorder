import { relations } from "drizzle-orm";
import {
  users,
  meetings,
  transcripts,
  transcriptSegments,
  summaries,
  meetingBots,
} from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  meetings: many(meetings),
  bots: many(meetingBots),
}));

export const meetingsRelations = relations(meetings, ({ one, many }) => ({
  user: one(users, { fields: [meetings.userId], references: [users.id] }),
  transcript: one(transcripts, {
    fields: [meetings.id],
    references: [transcripts.meetingId],
  }),
  summary: one(summaries, {
    fields: [meetings.id],
    references: [summaries.meetingId],
  }),
  bot: one(meetingBots, {
    fields: [meetings.id],
    references: [meetingBots.meetingId],
  }),
}));

export const transcriptsRelations = relations(transcripts, ({ one, many }) => ({
  meeting: one(meetings, {
    fields: [transcripts.meetingId],
    references: [meetings.id],
  }),
  segments: many(transcriptSegments),
}));

export const transcriptSegmentsRelations = relations(
  transcriptSegments,
  ({ one }) => ({
    transcript: one(transcripts, {
      fields: [transcriptSegments.transcriptId],
      references: [transcripts.id],
    }),
  })
);

export const summariesRelations = relations(summaries, ({ one }) => ({
  meeting: one(meetings, {
    fields: [summaries.meetingId],
    references: [meetings.id],
  }),
}));

export const meetingBotsRelations = relations(meetingBots, ({ one }) => ({
  user: one(users, {
    fields: [meetingBots.userId],
    references: [users.id],
  }),
  meeting: one(meetings, {
    fields: [meetingBots.meetingId],
    references: [meetings.id],
  }),
}));
