"use client";

import * as React from "react";
import { ChevronsUpDown, UserRoundCog, Star } from "lucide-react";
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
  updateLocalCache,
  updateUserCache,
} from "@/lib/redux/slices/cacheSlice";
import { AppDispatch } from "@/lib/redux/store";
import { useDispatch } from "react-redux";
import { useCurrentRole } from "@/hooks/use-current-role";
import { useSelectorUser } from "@/hooks/use-auth";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { Badge } from "@/components/ui/badge";
import { Semester } from "@/types/semester";

interface RoleSwitcherProps {
  currentSemester?: Semester;
}

export function RoleSwitcher({ currentSemester }: RoleSwitcherProps) {
  const currentSemesterId = currentSemester?.id;
  const { isMobile } = useSidebar();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelectorUser();

  if (!user) {
    return null;
  }

  // Lọc và map roles
  const filteredRoles = user.userXRoles
    .filter((userRole) =>
      currentSemesterId
        ? userRole.semesterId === currentSemesterId || userRole.isPrimary
        : true
    )
    .map((userRole) => ({
      ...userRole,
      roleInfo: getRoleInfo(userRole.role?.roleName || ""),
      isCurrentSemester: userRole.semesterId === currentSemesterId,
    }));

  // Sắp xếp roles: primary trước, current semester trước
  const sortedRoles = [...filteredRoles].sort((a, b) => {
    // Primary roles first
    if (a.isPrimary !== b.isPrimary) {
      return a.isPrimary ? -1 : 1;
    }
    // Then current semester roles
    if (a.isCurrentSemester !== b.isCurrentSemester) {
      return a.isCurrentSemester ? -1 : 1;
    }
    // Finally by role name
    return (a.role?.roleName || "").localeCompare(b.role?.roleName || "");
  });

  // Active role logic
  const activeRolePlan = useCurrentRole();
  const activeRole =
    sortedRoles.find((role) => role.role?.roleName === activeRolePlan) ||
    sortedRoles.find((role) => role.isPrimary);

  if (!activeRole) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="flex aspect-square size-4 items-center justify-center rounded-lg">
                <UserRoundCog className="dark:text-white text-black" />
              </div>
              <div className="flex flex-row items-center gap-2 text-sm leading-tight">
                <TypographyP className="truncate">
                  Vai trò: {activeRole.roleInfo?.describe}
                  {activeRole.isPrimary && (
                    <Badge variant="outline" className="ml-2">
                      Mặc định
                    </Badge>
                  )}
                </TypographyP>
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
              {currentSemesterId ? "Vai trò trong kỳ này" : "Vai trò hệ thống"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {sortedRoles.map((role, index) => (
              <DropdownMenuItem
                key={`${role.roleId}-${role.semesterId}`}
                onClick={() => {
                  const payload = {
                    role: role.role?.roleName,
                  };
                  dispatch(updateLocalCache(payload));
                  dispatch(updateUserCache(payload));
                }}
                className="gap-2 p-2"
              >
                <div className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <UserRoundCog className="size-4 shrink-0" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {role.roleInfo?.describe}
                      {role.isPrimary && (
                        <Star className="size-3 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    {role.semesterId && (
                      <div className="text-xs text-muted-foreground">
                        Kỳ: {currentSemester?.semesterName || "N/A"}
                      </div>
                    )}
                  </div>
                </div>
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

// Helper function to get role info
function getRoleInfo(roleName: string) {
  const roleMap = {
    Student: { describe: "Sinh viên" },
    Lecturer: { describe: "Giảng viên" },
    Council: { describe: "Hội đồng" },
    Reviewer: { describe: "Người đánh giá" },
    Manager: { describe: "Quản lý" },
    Admin: { describe: "Quản trị viên" },
  };

  return roleMap[roleName as keyof typeof roleMap] || { describe: roleName };
}
