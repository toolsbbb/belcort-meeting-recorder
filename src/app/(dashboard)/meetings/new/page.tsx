import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploadZone } from "@/components/upload/file-upload-zone";
import { FileUp, Mic, Bot } from "lucide-react";

export default function NewMeetingPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Meeting</h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload a recording, record live, or send a bot to capture your
          meeting.
        </p>
      </div>

      <Tabs defaultValue="upload">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" className="gap-2">
            <FileUp className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="record" className="gap-2" disabled>
            <Mic className="h-4 w-4" />
            Record
          </TabsTrigger>
          <TabsTrigger value="bot" className="gap-2" disabled>
            <Bot className="h-4 w-4" />
            Bot
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Recording</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploadZone />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="record">
          <Card>
            <CardContent className="py-12 text-center">
              <Mic className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4 text-gray-500">
                Live recording coming in Phase 2.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bot">
          <Card>
            <CardContent className="py-12 text-center">
              <Bot className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4 text-gray-500">
                Meeting bot coming in Phase 3.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
