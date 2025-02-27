"use client";
import { MdOutlineSupervisorAccount } from "react-icons/md";

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Globe,
  Home,
  Lightbulb,
  Logs,
  Mails,
  Map,
  MessageCircleQuestion,
  Pencil,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  UsersRound,
  SquareUserRound,
} from "lucide-react";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-project";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import { RootState } from "@/lib/redux/store";
import { useSelector } from "react-redux";
import { Icons } from "@/components/ui/icons";
import { TypographyH4 } from "@/components/_common/typography/typography-h4";
import Link from "next/link";
import { TypographyLarge } from "@/components/_common/typography/typography-large";
import { GiWideArrowDunk } from "react-icons/gi";
import { PiUserList } from "react-icons/pi";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: true,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: SquareUserRound,
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
      // items: [
      //   {
      //     title: "List",
      //     icon: Logs,
      //     url: "/supervisors",
      //   },
      //   {
      //     title: "Ideas",
      //     icon: Lightbulb,
      //     url: "/supervisors/ideas",
      //   },
      // ],
    },
    {
      title: "Support",
      url: "/#",
      icon: MessageCircleQuestion,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useSelector((state: RootState) => state.user.user);

  if (!user) {
    return null; // Hoặc hiển thị loading nếu muốn
  }
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
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
}
