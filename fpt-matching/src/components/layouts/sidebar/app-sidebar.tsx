"use client";
import { MdOutlineRateReview, MdOutlineSupervisorAccount } from "react-icons/md";
import { Globe, Home, Lightbulb, MessageCircleQuestion, Pencil, Send, UsersRound } from "lucide-react";
import * as React from "react";
import { TypographyLarge } from "@/components/_common/typography/typography-large";
import { Icons } from "@/components/ui/icons";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenuButton, SidebarRail } from "@/components/ui/sidebar";
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
    { title: "Home", url: "/", icon: Home, isActive: true },
    { title: "Social", url: "/social/blog", icon: Globe },
    { title: "Team", url: "/team", icon: UsersRound },
    { title: "My request", url: "/my-request", icon: Send },
    {
      title: "Idea", url: "/idea", icon: Lightbulb, items: [
        { title: "Create Idea", icon: Pencil, url: "/idea/create" },
        { title: "Request Idea", icon: GiWideArrowDunk, url: "/idea/request" },
        { title: "Ideas of Supervisor", icon: PiUserList, url: "/idea/supervisors" },
      ]
    },
    { title: "List supervisors", url: "/supervisors", icon: MdOutlineSupervisorAccount },
    { title: "Support", url: "/#", icon: MessageCircleQuestion },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  if (!user) return null;

  const firstRole = user.userXRoles[0]?.role?.roleName;
  React.useEffect(() => {
    if (user.cache) {
      dispatch(initializeRole(user.cache));
    } else {
      dispatch(updateUserCache({ newCache: { role: firstRole } }));
    }
  }, [user.cache, dispatch]);

  const role = useCurrentRole();
  const isCouncil = role === "Council";
  const isLecturer = role === "Lecturer";
  const isReviewer = role === "Reviewer";

  const navMain = data.navMain.map((item) => {
    if (item.title !== "Idea") return item;

    const commonItems = [
      { title: "Create Idea", icon: Pencil, url: "/idea/create" },
      { title: "Request Idea", icon: GiWideArrowDunk, url: "/idea/request" },
      { title: "Ideas of Supervisor", icon: PiUserList, url: "/idea/supervisors" },
    ];

    let ideaItems = commonItems;

    switch (true) {
      case isCouncil:
        ideaItems = [...commonItems,
        { title: "Approve Idea", icon: Lightbulb, url: "/idea/approve-idea" }];
        break;
      case isReviewer:
        ideaItems = [
          { title: "Review Idea", icon: MdOutlineRateReview, url: "/idea/review-idea" },
          { title: "Ideas of Supervisor", icon: PiUserList, url: "/idea/supervisors" }
        ];
        break;
      case isLecturer:
        ideaItems = [...commonItems,
        { title: "Approve Idea", icon: Lightbulb, url: "/idea/approve-idea" }];
        break;
    }

    return { ...item, items: ideaItems };
  });

  return (
    <Sidebar collapsible="icon" {...props} variant="inset">
      <SidebarHeader>
        <SidebarMenuButton asChild size="lg" className="overflow-visible data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground gap-3">
          <Link href="/">
            <div className="flex aspect-square size-10 items-center justify-center rounded-lg text-sidebar-primary-foreground">
              <Icons.logo />
            </div>
            <div className="grid flex-1 text-left text-sm tracking-wider">
              <TypographyLarge className="truncate tracking-wide">{"Team Matching"}</TypographyLarge>
            </div>
          </Link>
        </SidebarMenuButton>
        <RoleSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
