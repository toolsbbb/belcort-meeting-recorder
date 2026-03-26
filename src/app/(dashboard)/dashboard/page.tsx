import { currentUser } from "@clerk/nextjs/server";
import { FileAudio, Clock, Calendar, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const stats = [
  { name: "Total Meetings", value: "0", icon: FileAudio },
  { name: "Hours Recorded", value: "0h", icon: Clock },
  { name: "This Week", value: "0", icon: Calendar },
];

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName || "there"}
        </h1>
        <p className="mt-1 text-gray-500">
          Here&apos;s an overview of your meeting activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/meetings/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Upload Meeting
            </Button>
          </Link>
          <Button variant="outline" disabled className="gap-2">
            Record Meeting
            <span className="text-xs text-gray-400">(Phase 2)</span>
          </Button>
          <Button variant="outline" disabled className="gap-2">
            Send Bot
            <span className="text-xs text-gray-400">(Phase 3)</span>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Meetings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Meetings</CardTitle>
          <Link href="/meetings">
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileAudio className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No meetings yet
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Upload your first meeting recording to get started.
            </p>
            <Link href="/meetings/new" className="mt-4">
              <Button size="sm">Upload Meeting</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
