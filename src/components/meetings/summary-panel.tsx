"use client";

import { useState } from "react";
import { Sparkles, RefreshCw, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface SummaryPanelProps {
  meetingId: string;
  summary: {
    content: string;
    keyTopics: string[] | null;
    actionItems: { text: string; assignee?: string; completed: boolean }[] | null;
  } | null;
  hasTranscript: boolean;
}

export function SummaryPanel({
  meetingId,
  summary,
  hasTranscript,
}: SummaryPanelProps) {
  const [generating, setGenerating] = useState(false);
  const [content, setContent] = useState(summary?.content || "");
  const [copied, setCopied] = useState(false);

  const generateSummary = async () => {
    try {
      setGenerating(true);
      setContent("");

      const res = await fetch(`/api/meetings/${meetingId}/summary`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to generate summary");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setContent(accumulated);
      }

      toast.success("Summary generated!");
    } catch (error) {
      toast.error("Failed to generate summary");
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const copyContent = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  };

  if (!hasTranscript) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Sparkles className="h-10 w-10 text-gray-300" />
        <p className="mt-3 text-sm text-gray-500">
          Transcript needed before generating a summary.
        </p>
      </div>
    );
  }

  if (!content && !generating) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Sparkles className="h-10 w-10 text-purple-300" />
        <h3 className="mt-3 font-medium text-gray-900">
          Generate AI Summary
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Get key topics, decisions, and action items.
        </p>
        <Button
          onClick={generateSummary}
          className="mt-4 gap-2"
          size="sm"
        >
          <Sparkles className="h-4 w-4" />
          Generate Summary
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={copyContent}
          disabled={!content}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={generateSummary}
          disabled={generating}
        >
          {generating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Key Topics */}
      {summary?.keyTopics && summary.keyTopics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {summary.keyTopics.map((topic, i) => (
            <Badge key={i} variant="secondary">
              {topic}
            </Badge>
          ))}
        </div>
      )}

      {/* Summary content */}
      <div className="prose prose-sm max-w-none">
        {content.split("\n").map((line, i) => {
          if (line.startsWith("## ")) {
            return (
              <h3 key={i} className="mt-4 text-base font-semibold text-gray-900">
                {line.replace("## ", "")}
              </h3>
            );
          }
          if (line.startsWith("- [ ] ")) {
            return (
              <div key={i} className="flex items-start gap-2 text-sm">
                <input type="checkbox" className="mt-1" disabled />
                <span>{line.replace("- [ ] ", "")}</span>
              </div>
            );
          }
          if (line.startsWith("- ")) {
            return (
              <li key={i} className="ml-4 text-sm text-gray-700">
                {line.replace("- ", "")}
              </li>
            );
          }
          if (line.trim() === "") return <br key={i} />;
          return (
            <p key={i} className="text-sm text-gray-700">
              {line}
            </p>
          );
        })}
        {generating && (
          <span className="inline-block h-4 w-1 animate-pulse bg-blue-500" />
        )}
      </div>
    </div>
  );
}
