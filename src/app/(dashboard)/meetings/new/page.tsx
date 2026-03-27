import { FileUploadZone } from "@/components/upload/file-upload-zone";

export default function NewMeetingPage() {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-lg font-semibold text-gray-900">Upload Recording</h1>
      <p className="mt-1 text-sm text-gray-500">
        Upload an audio or video file to transcribe.
      </p>
      <div className="mt-4">
        <FileUploadZone />
      </div>
    </div>
  );
}
