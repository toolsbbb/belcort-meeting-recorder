import { Bot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function BotsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meeting Bot</h1>
        <p className="mt-1 text-sm text-gray-500">
          Send a bot to automatically join and record your meetings.
        </p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Bot className="h-16 w-16 text-gray-300" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Coming in Phase 3
          </h2>
          <p className="mt-2 max-w-md text-gray-500">
            Paste a Zoom, Google Meet, or Teams link and our bot will join,
            record, and transcribe the meeting automatically. For now, you can
            upload pre-recorded audio files.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
