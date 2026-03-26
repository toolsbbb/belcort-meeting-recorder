import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { searchTranscripts } from "@/lib/services/search";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [], total: 0 });
    }

    const offset = (page - 1) * limit;
    const results = await searchTranscripts(userId, query, limit, offset);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search failed:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
