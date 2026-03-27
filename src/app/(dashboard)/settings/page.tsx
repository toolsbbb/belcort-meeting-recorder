import { UserProfile } from "@clerk/nextjs";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold text-gray-900">Settings</h1>
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
