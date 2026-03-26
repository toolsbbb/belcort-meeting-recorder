"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileAudio, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ACCEPTED_AUDIO_TYPES, MAX_FILE_SIZE } from "@/lib/constants";

export function FileUploadZone() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<string>("");
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((f: File) => {
    if (f.size > MAX_FILE_SIZE) {
      toast.error("File too large. Maximum size is 500MB.");
      return;
    }
    setFile(f);
    if (!title) {
      setTitle(f.name.replace(/\.[^.]+$/, ""));
    }
  }, [title]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    try {
      setUploading(true);

      // Step 1: Get presigned URL
      setStage("Getting upload URL...");
      setProgress(10);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
        }),
      });
      if (!uploadRes.ok) throw new Error("Failed to get upload URL");
      const { url, key } = await uploadRes.json();

      // Step 2: Upload file directly to S3/R2
      setStage("Uploading file...");
      setProgress(20);
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            setProgress(20 + (e.loaded / e.total) * 50);
          }
        });
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error("Upload failed"));
        });
        xhr.addEventListener("error", () => reject(new Error("Upload failed")));
        xhr.open("PUT", url);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });

      // Step 3: Create meeting record
      setStage("Creating meeting...");
      setProgress(75);
      const meetingRes = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          source: "upload",
          audioKey: key,
          audioFileSize: file.size,
          audioMimeType: file.type,
        }),
      });
      if (!meetingRes.ok) throw new Error("Failed to create meeting");
      const meeting = await meetingRes.json();

      // Step 4: Start transcription
      setStage("Starting transcription...");
      setProgress(90);
      await fetch("/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingId: meeting.id }),
      });

      setProgress(100);
      setStage("Done!");
      toast.success("Meeting uploaded! Transcription in progress.");
      router.push(`/meetings/${meeting.id}`);
    } catch (error) {
      toast.error("Upload failed. Please try again.");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
          dragOver
            ? "border-blue-400 bg-blue-50"
            : file
              ? "border-green-300 bg-green-50"
              : "border-gray-300 bg-white hover:border-gray-400"
        }`}
      >
        {file ? (
          <div className="flex items-center gap-3">
            <FileAudio className="h-8 w-8 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setFile(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <Upload className="h-10 w-10 text-gray-400" />
            <p className="mt-4 text-sm font-medium text-gray-900">
              Drag and drop your audio file here
            </p>
            <p className="mt-1 text-xs text-gray-500">
              MP3, WAV, WebM, OGG, FLAC, M4A, or MP4 (up to 500MB)
            </p>
            <label className="mt-4 cursor-pointer">
              <Button type="button" variant="outline" size="sm" render={<span />}>
                Browse Files
              </Button>
              <input
                type="file"
                className="hidden"
                accept={ACCEPTED_AUDIO_TYPES.join(",")}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </label>
          </>
        )}
      </div>

      {/* Title & Description */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Meeting Title *
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Weekly Team Standup"
            className="mt-1"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">
            Description (optional)
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a brief description of the meeting..."
            className="mt-1"
            rows={3}
          />
        </div>
      </div>

      {/* Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{stage}</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        className="w-full gap-2"
        disabled={!file || !title || uploading}
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {stage}
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Upload & Transcribe
          </>
        )}
      </Button>
    </form>
  );
}
