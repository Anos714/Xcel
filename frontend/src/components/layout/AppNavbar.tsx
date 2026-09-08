"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PAGE_TITLES } from "@/constants/pageTitles";
import ThemeToggle from "./ThemeToggle";
import { Home } from "lucide-react";

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
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Go to Xcel home page"
        >
          <Home className="size-4" />
          <span className="hidden sm:inline">Home</span>
        </Link>
        <ThemeToggle />
        <Avatar className="h-9 w-9">
          <AvatarImage src="" alt="Rahul" />

          <AvatarFallback>RS</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
