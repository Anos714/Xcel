"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppNavbar from "./AppNavbar";
import AppSidebar from "./AppSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <AppNavbar />

        <main className="p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
