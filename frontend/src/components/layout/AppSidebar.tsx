"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { NAV_ITEMS } from "@/constants/navigation";

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b px-5 py-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">XOLO</h1>

          <p className="text-xs text-muted-foreground">AI X Automation</p>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className="
                      h-11
                      rounded-lg
                      transition-all
                      duration-200
                      hover:bg-muted
                      data-[active=true]:bg-primary
                      data-[active=true]:text-primary-foreground
                    "
                  >
                    <Link
                      href={item.href}
                      className="flex w-full items-center gap-3"
                    >
                      <item.icon className="h-5 w-5" />

                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
