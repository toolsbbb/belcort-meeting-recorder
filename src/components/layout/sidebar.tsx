"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileAudio,
  Mic,
  Bot,
  Search,
  Settings,
  AudioLines,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Meetings",
    href: "/meetings",
    icon: FileAudio,
  },
  {
    name: "Record",
    href: "/record",
    icon: Mic,
    badge: "Phase 2",
    disabled: true,
  },
  {
    name: "Meeting Bot",
    href: "/bots",
    icon: Bot,
    badge: "Phase 3",
    disabled: true,
  },
  {
    name: "Search",
    href: "/search",
    icon: Search,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <AudioLines className="h-7 w-7 text-blue-600" />
        <span className="text-lg font-bold text-gray-900">Belcort</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                item.disabled && "pointer-events-none opacity-50"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t px-6 py-4">
        <p className="text-xs text-gray-400">Belcort Meeting Recorder</p>
        <p className="text-xs text-gray-400">v1.0.0</p>
      </div>
    </div>
  );
}
