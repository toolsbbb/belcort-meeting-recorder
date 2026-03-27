import { Mic } from "lucide-react";

export default function RecordPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Mic className="h-10 w-10 text-gray-300" />
      <p className="mt-3 text-sm text-gray-500">
        Live recording coming soon.
      </p>
    </div>
  );
}
