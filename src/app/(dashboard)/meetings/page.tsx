import { getMeetings } from "@/lib/actions/meetings";
import { MeetingCard } from "@/components/meetings/meeting-card";
import { Button } from "@/components/ui/button";
import { FileAudio, Plus } from "lucide-react";
import Link from "next/link";

export default async function MeetingsPage() {
  const { meetings, total } = await getMeetings();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
          <p className="mt-1 text-sm text-gray-500">
            {total} meeting{total !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link href="/meetings/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Meeting
          </Button>
        </Link>
      </div>

      {meetings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-white py-16 text-center">
          <FileAudio className="h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No meetings yet
          </h3>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Upload your first meeting recording to get AI-powered transcription
            and summaries.
          </p>
          <Link href="/meetings/new" className="mt-4">
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Upload Meeting
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {meetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting as Parameters<typeof MeetingCard>[0]["meeting"]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
