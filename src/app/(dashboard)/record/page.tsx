import { Mic } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function RecordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Live Recording</h1>
        <p className="mt-1 text-sm text-gray-500">
          Record meetings directly in your browser with real-time transcription.
        </p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Mic className="h-16 w-16 text-gray-300" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Coming in Phase 2
          </h2>
          <p className="mt-2 max-w-md text-gray-500">
            Live recording with real-time transcription and speaker
            identification is coming soon. For now, you can upload pre-recorded
            audio files.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
