export const APP_NAME = "Belcort Meeting Recorder";

export const ACCEPTED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/webm",
  "audio/ogg",
  "audio/flac",
  "audio/m4a",
  "audio/x-m4a",
  "video/mp4",
];

export const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

export const MEETING_STATUSES = {
  uploading: "Uploading",
  transcribing: "Transcribing",
  summarizing: "Summarizing",
  completed: "Completed",
  failed: "Failed",
} as const;

export const MEETING_SOURCES = {
  upload: "Upload",
  recording: "Recording",
  bot: "Meeting Bot",
} as const;

export const SPEAKER_COLORS = [
  "bg-blue-100 text-blue-800",
  "bg-green-100 text-green-800",
  "bg-purple-100 text-purple-800",
  "bg-orange-100 text-orange-800",
  "bg-pink-100 text-pink-800",
  "bg-teal-100 text-teal-800",
  "bg-indigo-100 text-indigo-800",
  "bg-red-100 text-red-800",
];
