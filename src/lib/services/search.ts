import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export interface SearchResult {
  meetingId: string;
  title: string;
  createdAt: Date;
  headline: string;
  rank: number;
  duration: number | null;
  source: string;
}

export async function searchTranscripts(
  userId: string,
  query: string,
  limit = 20,
  offset = 0
): Promise<SearchResult[]> {
  const results = await db.execute(sql`
    SELECT
      m.id as meeting_id,
      m.title,
      m.created_at,
      m.duration,
      m.source,
      ts_headline(
        'english',
        t.full_text,
        websearch_to_tsquery('english', ${query}),
        'MaxWords=50, MinWords=20, StartSel=<mark>, StopSel=</mark>'
      ) as headline,
      ts_rank(
        to_tsvector('english', t.full_text),
        websearch_to_tsquery('english', ${query})
      ) as rank
    FROM meetings m
    JOIN transcripts t ON t.meeting_id = m.id
    WHERE m.user_id = ${userId}
      AND to_tsvector('english', t.full_text) @@ websearch_to_tsquery('english', ${query})
    ORDER BY rank DESC
    LIMIT ${limit} OFFSET ${offset}
  `);

  return results as unknown as SearchResult[];
}
