"use client";

import { UserButton } from "@clerk/nextjs";
import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import Link from "next/link";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-6">
      {/* Mobile menu */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" />}>
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* Right side */}
      <div className="flex flex-1 items-center justify-end gap-3">
        <Link href="/meetings/new">
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Meeting</span>
          </Button>
        </Link>
        <UserButton />
      </div>
    </header>
  );
}
