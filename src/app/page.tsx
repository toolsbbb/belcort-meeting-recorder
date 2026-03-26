import Link from "next/link";
import { AudioLines, Mic, FileUp, Bot, Sparkles, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: FileUp,
    title: "Upload & Transcribe",
    description:
      "Upload audio or video files and get accurate transcriptions with speaker identification.",
  },
  {
    icon: Mic,
    title: "Live Recording",
    description:
      "Record meetings directly in your browser with real-time transcription.",
  },
  {
    icon: Bot,
    title: "Meeting Bot",
    description:
      "Send a bot to join your Zoom, Google Meet, or Teams meetings automatically.",
  },
  {
    icon: Sparkles,
    title: "AI Summaries",
    description:
      "Get AI-powered meeting summaries, action items, and key decisions instantly.",
  },
  {
    icon: Search,
    title: "Search Everything",
    description:
      "Search across all your meeting transcripts to find exactly what was discussed.",
  },
  {
    icon: AudioLines,
    title: "Speaker Identification",
    description:
      "Automatically identify who said what with advanced speaker diarization.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
        <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Nav */}
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AudioLines className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Belcort</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Get Started</Button>
              </Link>
            </div>
          </nav>

          {/* Hero content */}
          <div className="mx-auto mt-20 max-w-3xl text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Never miss a detail in your{" "}
              <span className="text-blue-600">meetings</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Belcort records, transcribes, and summarizes your meetings with
              AI-powered intelligence. Get automatic speaker identification,
              action items, and searchable transcripts.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="gap-2 text-base">
                  <Sparkles className="h-5 w-5" />
                  Start Free
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" size="lg" className="text-base">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Everything you need for meeting intelligence
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Powerful features to capture, understand, and act on your meetings.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                <feature.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-gray-50 px-4 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <AudioLines className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-gray-900">Belcort</span>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Belcort. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
