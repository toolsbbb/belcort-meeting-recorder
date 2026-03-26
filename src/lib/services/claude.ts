import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const SYSTEM_PROMPT = `You are Belcort, an AI meeting analysis assistant. You analyze meeting transcripts and produce structured, actionable summaries.

When given a meeting transcript, produce the following sections in markdown:

## Summary
A concise 2-4 sentence overview of the meeting.

## Key Topics
List the main topics discussed as bullet points.

## Decisions Made
List any decisions that were made during the meeting.

## Action Items
List action items in this format:
- [ ] **[Assignee if mentioned]**: Task description

## Notable Quotes
Include 1-3 important or notable quotes from the meeting with speaker attribution.

Be concise, professional, and focus on actionable information. If a section has no relevant content, omit it entirely.`;

export async function generateSummaryStream(transcriptText: string) {
  const stream = await anthropic.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Please analyze and summarize the following meeting transcript:\n\n${transcriptText}`,
      },
    ],
  });

  return stream;
}

export async function generateSummary(transcriptText: string): Promise<{
  content: string;
  promptTokens: number;
  completionTokens: number;
}> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Please analyze and summarize the following meeting transcript:\n\n${transcriptText}`,
      },
    ],
  });

  const content =
    response.content[0].type === "text" ? response.content[0].text : "";

  return {
    content,
    promptTokens: response.usage.input_tokens,
    completionTokens: response.usage.output_tokens,
  };
}

export function extractActionItems(
  summaryContent: string
): { text: string; assignee?: string; completed: boolean }[] {
  const actionItemRegex = /- \[ \] \*\*\[?([^\]]*?)\]?\*\*:?\s*(.+)/g;
  const items: { text: string; assignee?: string; completed: boolean }[] = [];

  let match;
  while ((match = actionItemRegex.exec(summaryContent)) !== null) {
    items.push({
      assignee: match[1]?.trim() || undefined,
      text: match[2].trim(),
      completed: false,
    });
  }

  return items;
}

export function extractKeyTopics(summaryContent: string): string[] {
  const topicsSection = summaryContent.match(
    /## Key Topics\n([\s\S]*?)(?=\n## |$)/
  );
  if (!topicsSection) return [];

  const topics = topicsSection[1]
    .split("\n")
    .filter((line) => line.startsWith("- ") || line.startsWith("* "))
    .map((line) => line.replace(/^[-*]\s+/, "").trim())
    .filter(Boolean);

  return topics;
}
