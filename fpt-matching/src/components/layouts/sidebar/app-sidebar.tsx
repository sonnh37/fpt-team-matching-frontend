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
} from "lucide-react";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-project";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import { RootState } from "@/lib/redux/store";
import { useSelector } from "react-redux";

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: true,
    },
    {
      title: "Social",
      url: "#",
      icon: Globe,
    },
    {
      title: "Team",
      url: "#",
      icon: UsersRound,
    },
    {
      title: "My request",
      url: "#",
      icon: Send,
    },
    {
      title: "Create idea",
      url: "#",
      icon: Pencil,
    },
    {
      title: "Support",
      url: "#",
      icon: MessageCircleQuestion,
    },
    {
      title: "Supervisors",
      url: "#",
      icon: MdOutlineSupervisorAccount,
      items: [
        {
          title: "List",
          icon: Logs,
          url: "#",
        },
        {
          title: "Ideas",
          icon: Lightbulb,
          url: "#",
        },
      ],
    },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>

        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
