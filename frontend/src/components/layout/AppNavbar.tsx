"use client";

import { usePathname } from "next/navigation";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PAGE_TITLES } from "@/constants/pageTitles";

export default function AppNavbar() {
  const pathname = usePathname();

  const title = PAGE_TITLES[pathname] || "XOLO";

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-6">
      {/* Left */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="opacity-100 hover:opacity-100" />

        <div>
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <Avatar className="h-9 w-9">
          <AvatarImage src="" alt="Rahul" />

          <AvatarFallback>RS</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
