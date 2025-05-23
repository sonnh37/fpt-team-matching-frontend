// layouts/SettingsLayout.tsx
'use client';
import {Separator} from "@/components/ui/separator";
import React from "react";
import {SidebarNav} from "./components/sidebar-nav";

// Dữ liệu sidebar
const sidebarNavItems = [
    {title: "Profile", href: "/settings"},
    {title: "Password and security", href: "/settings/password-security"},
    {title: "Appearance", href: "/settings/appearance"},
    {title: "Notifications", href: "/settings/notifications"},
    {title: "Display", href: "/settings/display"},
];

interface SettingsLayoutProps {
    children: React.ReactNode;
}

export default function SettingsLayout({children}: SettingsLayoutProps) {
    return (
        <div className="hidden space-y-6 p-10 pb-16 md:block tracking-wide">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Cài đặt</h2>
                <p className="text-muted-foreground">
                Quản lý cài đặt tài khoản và thiết lập tùy chọn.
                </p>
            </div>
            <Separator className="my-6"/>
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 lg:w-1/5">
                    <SidebarNav items={sidebarNavItems}/>
                </aside>
                <div className="flex-1 lg:max-w-2xl">
                    {/* Truyền `user` vào `children` */}
                    {children}
                </div>
            </div>
        </div>
    );
};
