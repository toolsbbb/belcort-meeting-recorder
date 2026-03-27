"use client";

import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-white px-4">
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" />}>
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-56 p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex-1" />
      <UserButton />
    </header>
  );
}
