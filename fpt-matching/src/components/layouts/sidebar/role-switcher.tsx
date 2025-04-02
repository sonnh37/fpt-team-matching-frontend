"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, UserRoundCog } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  initializeRole,
  setRole,
  updateUserCache,
} from "@/lib/redux/slices/roleSlice";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useCurrentRole } from "@/hooks/use-current-role";
import { useSelectorUser } from "@/hooks/use-auth";
import { TypographyList } from "@/components/_common/typography/typography-list";
import { TypographyP } from "@/components/_common/typography/typography-p";

export function RoleSwitcher() {
  const { isMobile } = useSidebar();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelectorUser();

  if (!user) {
    return null;
  }

  // lọc ra user hiện tại có bao nhiêu role
  const userRoles = user.userXRoles.map((m) => m.role?.roleName);
  const roles = [
    { name: "Role", logo: UserRoundCog, plan: "Student" },
    { name: "Role", logo: UserRoundCog, plan: "Lecturer" },
    { name: "Role", logo: UserRoundCog, plan: "Council" },
    { name: "Role", logo: UserRoundCog, plan: "Reviewer" },
    { name: "Role", logo: UserRoundCog, plan: "Manager" },
    { name: "Role", logo: UserRoundCog, plan: "Admin" },
  ].filter((role) => userRoles.includes(role.plan));

  // role đang đc chọn từ db , nếu ko có auto student
  const activeRolePlan = useCurrentRole() || roles[0]?.plan;
  const activeRole = roles.find((role) => role.plan === activeRolePlan);
  if (!activeRole) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="flex aspect-square size-4 items-center justify-center rounded-lg ">
                <UserRoundCog className=" dark:text-white text-black" />
              </div>
              <div className="flex flex-row items-center gap-2 text-sm leading-tight">
                <TypographyP className="truncate">Role: {activeRole.plan}</TypographyP>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Roles
            </DropdownMenuLabel>
            {roles.map((role, index) => (
              <DropdownMenuItem
                key={role.plan}
                onClick={() => {
                  dispatch(setRole(role.plan));
                  dispatch(updateUserCache({ newCache: { role: role.plan } }));
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <role.logo className="size-4 shrink-0" />
                </div>
                {role.plan}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
