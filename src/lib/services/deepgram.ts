import { DeepgramClient } from "@deepgram/sdk";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deepgram = new DeepgramClient({ apiKey: process.env.DEEPGRAM_API_KEY! } as any);

export interface TranscriptionResult {
  fullText: string;
  wordCount: number;
  confidence: number;
  language: string;
  segments: {
    speakerIndex: number;
    startTime: number;
    endTime: number;
    text: string;
    confidence: number;
  }[];
}

export async function transcribeAudioUrl(
  audioUrl: string
): Promise<TranscriptionResult> {
  const response = await deepgram.listen.v1.media.transcribeUrl({
    url: audioUrl,
    model: "nova-3",
    smart_format: true,
    diarize: true,
    paragraphs: true,
    utterances: true,
    punctuate: true,
    language: "en",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = response as any;

  const channel = result.results?.channels?.[0];
  const alternative = channel?.alternatives?.[0];

  const segments =
    result.results?.utterances?.map((u: any) => ({
      speakerIndex: u.speaker ?? 0,
      startTime: u.start,
      endTime: u.end,
      text: u.transcript,
      confidence: u.confidence,
    })) ?? [];

  return {
    fullText: alternative?.transcript ?? "",
    wordCount: alternative?.words?.length ?? 0,
    confidence: alternative?.confidence ?? 0,
    language: channel?.detected_language ?? "en",
    segments,
  };
}

export async function createTemporaryApiKey(): Promise<{
  key: string;
  apiKeyId: string;
}> {
  // Phase 2: Will use Deepgram's key management for live transcription
  // For now, return the main API key (development only)
  return {
    key: process.env.DEEPGRAM_API_KEY!,
    apiKeyId: "main",
  };
}
