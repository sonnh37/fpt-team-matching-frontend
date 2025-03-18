"use client";
import { MdOutlineSupervisorAccount } from "react-icons/md";

import {
  Globe,
  Home,
  Lightbulb,
  MessageCircleQuestion,
  Pencil,
  Send,
  SquareUserRound,
  UserRoundCog,
  UsersRound,
} from "lucide-react";
import * as React from "react";

import { TypographyLarge } from "@/components/_common/typography/typography-large";
import { Icons } from "@/components/ui/icons";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { AppDispatch, RootState } from "@/lib/redux/store";
import Link from "next/link";
import { GiWideArrowDunk } from "react-icons/gi";
import { PiUserList } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { NavMain } from "./nav-main";
import { RoleSwitcher } from "./role-switcher";
import { useCurrentRole } from "@/hooks/use-current-role";
import { initializeRole, updateUserCache } from "@/lib/redux/slices/roleSlice";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: true,
    },
    {
      title: "Social",
      url: "/social/blog",
      icon: Globe,
    },
    {
      title: "Team",
      url: "/team",
      icon: UsersRound,
    },
    {
      title: "My request",
      url: "/my-request",
      icon: Send,
    },
    {
      title: "Idea",
      url: "/idea",
      icon: Lightbulb,
      items: [
        {
          title: "Create Idea",
          icon: Pencil,
          url: "/idea/create",
        },
        {
          title: "Request Idea",
          icon: GiWideArrowDunk,
          url: "/idea/request",
        },
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
    {
      title: "Support",
      url: "/#",
      icon: MessageCircleQuestion,
    },
    {
      title: "Manage review",
      url: "/manage-review",
      icon: SquareUserRound,
    }
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  if (!user) return;
  const userRoles = user.userXRoles.map((m) => m.role?.roleName);
  const firstRole = user.userXRoles[0]?.role?.roleName;
  React.useEffect(() => {
    if (user?.cache) {
      dispatch(initializeRole(user.cache));
    } else {
      dispatch(updateUserCache({ newCache: { role: firstRole } }));
    }
  }, [user?.cache, dispatch]);

  const role = useCurrentRole();
  const isCouncil = role == "Council";
  const isLecturer = role == "Lecturer";
  const isStudent = role == "Student";
  const isReviewer = role == "Reviewer";

  const navMain = data.navMain.map((item) => {
    if (item.title === "Idea") {
      return {
        ...item,
        items: isCouncil
          ? [
              {
                title: "Approve Idea",
                icon: Lightbulb,
                url: "/idea/approve-idea",
              },
              {
                title: "Ideas of Supervisor",
                icon: PiUserList,
                url: "/idea/supervisors",
              },
            ]
          : isReviewer || isLecturer
          ? [
              { title: "Create Idea", icon: Pencil, url: "/idea/create" },
              {
                title: "Request Idea",
                icon: GiWideArrowDunk,
                url: "/idea/request",
              },
              {
                title: "Approve Idea",
                icon: Lightbulb,
                url: "/idea/approve-idea",
              },
              {
                title: "Ideas of Supervisor",
                icon: PiUserList,
                url: "/idea/supervisors",
              },
            ]
          : [
              { title: "Create Idea", icon: Pencil, url: "/idea/create" },
              {
                title: "Request Idea",
                icon: GiWideArrowDunk,
                url: "/idea/request",
              },
              {
                title: "Ideas of Supervisor",
                icon: PiUserList,
                url: "/idea/supervisors",
              },
            ],
      };
    }
    return item;
  });

  return (
    <Sidebar collapsible="icon" {...props} variant="inset">
      <SidebarHeader>
        <SidebarMenuButton
          asChild
          size="lg"
          className="overflow-visible data-[state=open]:bg-sidebar-accent  data-[state=open]:text-sidebar-accent-foreground gap-3"
        >
          <Link href={"/"}>
            <div className="flex aspect-square size-10 items-center justify-center rounded-lg text-sidebar-primary-foreground">
              <Icons.logo />
            </div>
            <div className="grid flex-1 text-left text-sm tracking-wider">
              <TypographyLarge className="truncate tracking-wide">
                {"Team Matching"}
              </TypographyLarge>
            </div>
          </Link>
        </SidebarMenuButton>
        {<RoleSwitcher />}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
}
