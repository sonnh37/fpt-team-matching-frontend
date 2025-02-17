"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { IconType } from "react-icons/lib";
import { usePathname } from "next/navigation";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon | IconType;
    isActive?: boolean;
    items?: {
      title: string;
      icon?: LucideIcon | IconType;
      url: string;
    }[];
  }[];
}) {
  const pathName = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathName === item.url;
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              {item.items ? (
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isActive}
                      className="text-lg py-6 tracking-wide group-data-[collapsible=icon]:!p-1"
                    >
                      <div className="flex aspect-square size-5 items-center justify-start">
                        {item.icon && <item.icon />}
                      </div>
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            className="text-lg tracking-wide py-6 group-data-[collapsible=icon]:!p-1"
                            asChild
                            isActive={isActive}
                          >
                            <a href={subItem.url}>
                              <div className="flex aspect-square size-5 items-center justify-start">
                                {subItem.icon && <subItem.icon />}
                              </div>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              ) : (
                <SidebarMenuButton
                  className="text-lg tracking-wide py-6 group-data-[collapsible=icon]:!p-1"
                  tooltip={item.title}
                  asChild
                  isActive={isActive}
                >
                  <a href={item.url}>
                    <div className="flex aspect-square size-5 items-center justify-start">
                      {item.icon && <item.icon />}
                    </div>
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              )}
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
