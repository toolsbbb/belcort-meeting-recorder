import { SignIn } from "@clerk/nextjs";
import { AudioLines } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="mb-8 flex items-center gap-2">
        <AudioLines className="h-8 w-8 text-blue-600" />
        <span className="text-xl font-bold text-gray-900">
          Belcort Meeting Recorder
        </span>
      </div>
      <SignIn />
    </div>
  );
}
