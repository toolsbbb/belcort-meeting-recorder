import { getMeetings } from "@/lib/actions/meetings";
import { MeetingCard } from "@/components/meetings/meeting-card";
import { Button } from "@/components/ui/button";
import { FileAudio, Upload } from "lucide-react";
import Link from "next/link";

export default async function MeetingsPage() {
  const { meetings, total } = await getMeetings();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">
          Meetings{total > 0 ? ` (${total})` : ""}
        </h1>
        <Link href="/meetings/new">
          <Button size="sm" className="gap-1.5">
            <Upload className="h-3.5 w-3.5" />
            Upload
          </Button>
        </Link>
      </div>

      {meetings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-white py-12 text-center">
          <FileAudio className="h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">No meetings yet</p>
          <Link href="/meetings/new" className="mt-3">
            <Button size="sm" variant="outline" className="gap-1.5">
              <Upload className="h-3.5 w-3.5" />
              Upload a recording
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
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
