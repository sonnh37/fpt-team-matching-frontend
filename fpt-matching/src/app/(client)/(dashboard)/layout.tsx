"use client";
import { AppSidebar } from "@/components/layouts/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthDropdown } from "@/components/_common/auth-dropdown";
import DynamicBreadcrumbs from "@/components/_common/breadcrumbs/dynamic-breadcrumbs";
import { ChatPopover } from "@/components/_common/chat-popover";
import { NotificationPopover } from "@/components/_common/notification-popover";
import { Separator } from "@/components/ui/separator";
import { SidebarInset } from "@/components/ui/sidebar";
import { RootState } from "@/lib/redux/store";
import dynamic from "next/dynamic";
import React from "react";
import { useSelector } from "react-redux";
import { ModeToggle } from "@/components/_common/mode-toggle";
import { Card } from "@/components/ui/card"; // Thêm Card component

const Header = dynamic(
  () => import("@/components/layouts/navbar/header").then((mod) => mod.Header),
  { ssr: false }
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useSelector((state: RootState) => state.user.user);
  
  return (
    <SidebarProvider className="h-screen overflow-hidden">
      <AppSidebar />
      <SidebarInset className="overflow-hidden p-2">
        <Card className="bg-sidebar  flex h-16 z-10 rounded-lg shadow-sm items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumbs />
          </div>

          <div className="flex items-center gap-2 px-4">
            <ModeToggle />
            <NotificationPopover />
            <ChatPopover /> {/* Thêm lại nếu cần */}
            <AuthDropdown user={user} />
          </div>
        </Card>

        <div className="flex flex-1 flex-col overflow-hidden gap-4 mt-4">
          <Card className="flex-1 overflow-hidden p-0">
            <div className="p-4 h-full w-full overflow-auto">{children}</div>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}