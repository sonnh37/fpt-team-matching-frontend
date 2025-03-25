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
import { useCurrentRole } from "@/hooks/use-current-role";
import { initializeRole, updateUserCache } from "@/lib/redux/slices/roleSlice";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { semesterService } from "@/services/semester-service";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Globe,
  Home,
  Lightbulb,
  MessageCircleQuestion,
  Pencil,
  Send,
  ShieldHalf,
  SquareUserRound,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { GiWideArrowDunk } from "react-icons/gi";
import {
  MdOutlineRateReview,
  MdOutlineSupervisorAccount,
} from "react-icons/md";
import { PiUserList } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { NavMain } from "./nav-main";
import { RoleSwitcher } from "./role-switcher";
import { NavManagement } from "./nav-management";

const data = {
  navMain: [
    { title: "Home", url: "/", icon: Home, isActive: true },
    { title: "Social", url: "/social/blog", icon: Globe },
    { title: "Team", url: "/team", icon: UsersRound },
    { title: "Invitations", url: "/invitations", icon: Send },
    {
      title: "Idea",
      url: "/idea",
      icon: Lightbulb,
      items: [
        { title: "Create Idea", icon: Pencil, url: "/idea/create" },
        { title: "Request Idea", icon: GiWideArrowDunk, url: "/idea/request" },
        {
          title: "Ideas of Supervisor",
          icon: PiUserList,
          url: "/idea/supervisors",
        },
      ],
    },
    {
      title: "List supervisors",
      url: "/supervisors",
      icon: MdOutlineSupervisorAccount,
    },
    { title: "Support", url: "/#", icon: MessageCircleQuestion },
  ],

  navManage: [
    {
      title: "Manage review",
      url: "/manage-review",
      icon: SquareUserRound,
    },

    {
      title: "Manage semester",
      url: "/management/semester",
      icon: ShieldHalf,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  if (!user) return null;

  const { data: result } = useQuery({
    queryKey: ["getSemesterLatest_AppSidebar"],
    queryFn: () => semesterService.fetchLatest(),
    refetchOnWindowFocus: false,
  });

  React.useEffect(() => {
    if (user.cache) {
      dispatch(initializeRole(user.cache));
    } else {
      const firstRole = user.userXRoles[0]?.role?.roleName;

      dispatch(updateUserCache({ newCache: { role: firstRole } }));
    }
  }, [user, dispatch]);

  const role = useCurrentRole();
  const isCouncil = role === "Council";
  const isLecturer = role === "Lecturer";
  const isReviewer = role === "Reviewer";
  const isManager = role === "Manager";

  const navMain = data.navMain.map((item) => {
    if (item.title !== "Idea") return item;

    const commonItems = [
      { title: "Create Idea", icon: Pencil, url: "/idea/create" },
      { title: "Request Idea", icon: GiWideArrowDunk, url: "/idea/request" },
      {
        title: "Ideas of Supervisor",
        icon: PiUserList,
        url: "/idea/supervisors",
      },
    ];

    let ideaItems = commonItems;

    switch (true) {
      case isCouncil:
        ideaItems = [
          ...commonItems,
          { title: "Approve Idea", icon: Lightbulb, url: "/idea/approve-idea" },
        ];
        break;
      case isReviewer:
        ideaItems = [
          {
            title: "Review Idea",
            icon: MdOutlineRateReview,
            url: "/idea/review-idea",
          },
          {
            title: "Ideas of Supervisor",
            icon: PiUserList,
            url: "/idea/supervisors",
          },
        ];
        break;
      case isLecturer:
        ideaItems = [
          ...commonItems,
          { title: "Approve Idea", icon: Lightbulb, url: "/idea/approve-idea" },
        ];
        break;
    }

    return { ...item, items: ideaItems };
  });

  return (
    <Sidebar collapsible="icon" {...props} variant="inset">
      <SidebarHeader>
        <SidebarMenuButton
          asChild
          size="lg"
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
        <RoleSwitcher />
        <SidebarMenuButton
          size="lg"
          className="flex items-center  data-[state=open]:bg-sidebar-accent hover:cursor-default data-[state=open]:text-sidebar-accent-foreground"
          tooltip={result?.data?.semesterName}

          // isActive={isActive}
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
            {<Calendar className="size-4 dark:text-white text-black" />}
          </div>
          <span>{result?.data?.semesterCode}</span>
        </SidebarMenuButton>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <NavMain items={navMain} />
        {isManager && <NavManagement items={data.navManage} />}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
