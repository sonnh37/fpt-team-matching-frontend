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
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
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
              <a href={item.url}>
                <SidebarMenuButton
                  className="text-lg tracking-wide py-6 group-data-[collapsible=icon]:!p-1"
                  tooltip={item.title}
                >
                  <div className="flex aspect-square size-5 items-center justify-start">
                    {item.icon && <item.icon />}
                  </div>
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </a>
            )}
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
