"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  FileAudio,
  Mic,
  Bot,
  Search,
  Settings,
  AudioLines,
  Upload,
} from "lucide-react";

const navigation = [
  { name: "Meetings", href: "/meetings", icon: FileAudio },
  { name: "Upload", href: "/meetings/new", icon: Upload },
  { name: "Record", href: "/record", icon: Mic, disabled: true },
  { name: "Meeting Bot", href: "/bots", icon: Bot, disabled: true },
  { name: "Search", href: "/search", icon: Search },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-56 flex-col border-r bg-white">
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <AudioLines className="h-6 w-6 text-blue-600" />
        <span className="text-sm font-bold text-gray-900">Belcort</span>
      </div>

      <nav className="flex-1 space-y-0.5 px-2 py-3">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                item.disabled && "pointer-events-none opacity-40"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
