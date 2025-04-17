"use client";
import { TypographyLarge } from "@/components/_common/typography/typography-large";
import { Icons } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { filterNavItemsByRole, NAV_CONFIG } from "@/configs/nav-config";
import { useCurrentRole } from "@/hooks/use-current-role";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { semesterService } from "@/services/semester-service";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavMain } from "./nav-main";
import { NavManagement } from "./nav-management";
import { RoleSwitcher } from "./role-switcher";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { initializeCache, updateUserCache } from "@/lib/redux/slices/cacheSlice";
import { useTheme } from "next-themes";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const role = useCurrentRole();
  const currentCache = useSelector((state: RootState) => state.cache.cache); // Lấy toàn bộ cache
  const {setTheme} = useTheme();
  const { data: semesterData } = useQuery({
    queryKey: ["getSemesterLatest_AppSidebar"],
    queryFn: () => semesterService.getCurrentSemester(),
    refetchOnWindowFocus: false,
  });

  React.useEffect(() => {
    if (!user) return;

    // Khởi tạo cache khi có user
    if (user.cache) {
      dispatch(initializeCache(user.cache));
      
    } else {
      // Nếu không có cache, khởi tạo với role đầu tiên
      const primaryRole = user.userXRoles.find(role => role.isPrimary)?.role?.roleName;
      if (primaryRole) {
        setTheme("light");
        dispatch(updateUserCache({ role: primaryRole, theme: "light" }));
      }
    }
  }, [user, dispatch]);

  if (!user) return null;

  // Lọc navigation items theo role
  const filteredNavMain = filterNavItemsByRole(NAV_CONFIG.main, role as string);
  const filteredNavManage = filterNavItemsByRole(
    NAV_CONFIG.management,
    role as string
  );

  return (
    <Sidebar collapsible="icon" {...props} variant="inset">
      <SidebarHeader>
        <SidebarMenuButton
          asChild
          size={"lg"}
          className="overflow-visible data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground gap-3"
        >
          <Link href="/">
            <div className="flex aspect-square size-10 items-center justify-center rounded-lg text-sidebar-primary-foreground">
              <Icons.logo />
            </div>
            <div className="grid flex-1 text-left">
              <TypographyLarge className="truncate text-base uppercase">
                {"Team Matching"}
              </TypographyLarge>
            </div>
          </Link>
        </SidebarMenuButton>

        <RoleSwitcher currentSemester={semesterData?.data} />

        <SidebarMenuButton
          className="flex items-center data-[state=open]:bg-sidebar-accent hover:cursor-default hover:bg-transparent data-[state=open]:text-sidebar-accent-foreground"
          tooltip={semesterData?.data?.semesterName}
        >
          <div className="flex aspect-square size-4 items-center justify-center rounded-lg">
            <Calendar className="dark:text-white text-black" />
          </div>
          <div>
            <TypographyP className="truncate">
              Học kì: 
              {` ` + semesterData?.data?.semesterName + ""}
            </TypographyP>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>

      <Separator />

      <SidebarContent>
        <NavMain items={filteredNavMain} />
        {filteredNavManage.length > 0 && (
          <>
            <Separator className="my-2" />
            <NavManagement items={filteredNavManage} />
          </>
        )}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}