import { UserProfile } from "@clerk/nextjs";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account and preferences.
        </p>
      </div>
      <UserProfile
        appearance={{
          elements: {
            rootBox: "w-full",
            cardBox: "shadow-none border rounded-lg",
          },
        }}
      />
    </div>
  );
}
