import { Icons } from "@/components/ui/icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { MainNavItem } from "@/types";
import { User } from "@/types/user";
import Link from "next/link";
import * as React from "react";

import { ProductsCombobox } from "@/components/_common/products-combobox";
import { Const } from "@/lib/constants/const";
import { AuthDropdown } from "../../_common/auth-dropdown";
import { ModeToggle } from "../../_common/mode-toggle";

interface MainNavProps {
  items?: MainNavItem[];
  user?: User | null;
}

export function MainNav({ items, user = null }: MainNavProps) {
  return (
    <>
      <div className="hidden gap-6 text-lg lg:flex justify-between mx-auto w-full">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-neutral-500 bg-transparent uppercase">
                Thông tin
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-x-2.5 p-[22px] sm:w-[600px] lg:grid-cols-1">
                  <ListItem
                    href={`${Const.SOCIAL_INSTAGRAM}`}
                    title="Instagram"
                  >
                  </ListItem>
                  <ListItem href={`${Const.SOCIAL_FACEBOOK}`} title="Facebook">
                  </ListItem>
                  <ListItem href={`${Const.SOCIAL_TIKTOK}`} title="Tiktok">
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuIndicator />
          </NavigationMenuList>
        </NavigationMenu>

        <nav className="hidden bg-orange-600 lg:flex items-center justify-end space-x-4 w-fit px-4">
          <ModeToggle />
          <ProductsCombobox />
          {/* <CartSheet /> */}
          {/* <LocaleSwitcher /> */}
          <AuthDropdown user={user} />
        </nav>
      </div>
    </>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={String(href)}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          {title}
          {children && (
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          )}
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const ListItemV2 = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={String(href)}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <p className="text-lg group relative w-max">
            <span className="px-1 relative z-10 ">{title}</span>
            <span className="absolute left-0 bottom-0 w-full h-[0.25px] bg-neutral-300 transition-transform duration-300 scale-x-0 origin-left group-hover:scale-x-100 z-0 group-hover:bg-neutral-300 group-hover:h-full"></span>
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItemV2.displayName = "ListItemV2";
