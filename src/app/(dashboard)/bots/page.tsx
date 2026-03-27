import { Bot } from "lucide-react";

export default function BotsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Bot className="h-10 w-10 text-gray-300" />
      <p className="mt-3 text-sm text-gray-500">
        Meeting bot coming soon.
      </p>
    </div>
  );
}
