"use client";

import { useState, useCallback } from "react";
import { Search as SearchIcon, FileAudio, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface SearchResult {
  meeting_id: string;
  title: string;
  created_at: string;
  headline: string;
  rank: number;
  duration: number | null;
  source: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const debounceRef = { timer: null as NodeJS.Timeout | null };

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInput = (value: string) => {
    setQuery(value);
    if (debounceRef.timer) clearTimeout(debounceRef.timer);
    debounceRef.timer = setTimeout(() => search(value), 400);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Search Meetings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Search across all your meeting transcripts.
        </p>
      </div>

      {/* Search input */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          placeholder="Search transcripts..."
          className="pl-10 text-base h-12"
          autoFocus
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-gray-400" />
        )}
      </div>

      {/* Results */}
      {searched && results.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <SearchIcon className="h-10 w-10 text-gray-300" />
          <p className="mt-3 text-gray-500">
            No results found for &quot;{query}&quot;
          </p>
        </div>
      )}

      <div className="space-y-3">
        {results.map((result) => (
          <Link key={result.meeting_id} href={`/meetings/${result.meeting_id}`}>
            <Card className="transition-shadow hover:shadow-md cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FileAudio className="h-4 w-4 text-blue-600" />
                    <h3 className="font-medium text-gray-900">
                      {result.title}
                    </h3>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(result.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <div
                  className="mt-2 text-sm text-gray-600 [&>mark]:bg-yellow-200 [&>mark]:px-0.5 [&>mark]:rounded"
                  dangerouslySetInnerHTML={{ __html: result.headline }}
                />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
