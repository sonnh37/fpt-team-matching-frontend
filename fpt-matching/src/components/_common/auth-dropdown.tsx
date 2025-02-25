import Link from "next/link";

import { DashboardIcon, ExitIcon, GearIcon } from "@radix-ui/react-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth-service";
import { User } from "@/types/user";
import { Suspense } from "react";

interface AuthDropdownProps
  extends React.ComponentPropsWithRef<typeof DropdownMenuTrigger>,
    ButtonProps {
  user?: User | null;
}

export function AuthDropdown({ user = null }: AuthDropdownProps) {
  if (user == null) {
    return (
      <Link href="/login" className="uppercase text-xs">
        <Button className="bg-transparent text-orange-100">Đăng nhập</Button>
      </Link>
    );
  }

  const initials = `${user.firstName?.toUpperCase().charAt(0) ?? ""}${
    user.lastName?.toUpperCase().charAt(0) ?? ""
  }`;

  const handleLogout = () => {
    authService.logout().then((res) => {
      if (res.status == 1) {
        window.location.reload();
      }
    });
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={cn("size-8 focus-visible:ring-0")}>
          <Avatar className="size-8">
            <AvatarImage
              src={
                user.avatar && user.avatar.trim() !== ""
                  ? user.avatar
                  : undefined
              }
              alt={user.username ?? ""}
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <AvatarFallback className="bg-slate-200 rounded hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-500">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Suspense
          fallback={
            <div className="flex flex-col space-y-1.5 p-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full rounded-sm" />
              ))}
            </div>
          }
        >
          <AuthDropdownGroup user={user} />
        </Suspense>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <div onClick={handleLogout}>
            <ExitIcon className="mr-2 size-4" aria-hidden="true" />
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface AuthDropdownGroupProps {
  user?: User | null;
}

function AuthDropdownGroup({ user }: AuthDropdownGroupProps) {
  return (
    <DropdownMenuGroup>
      {user ? (
        <>
          <DropdownMenuItem asChild>
            <Link href={"/"}>
              <DashboardIcon className="mr-2 size-4" aria-hidden="true" />
              Dashboard
              <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <GearIcon className="mr-2 size-4" aria-hidden="true" />
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </>
      ) : (
        <>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <GearIcon className="mr-2 size-4" aria-hidden="true" />
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </>
      )}

      {/* <DropdownMenuItem asChild>
        <Link href="/dashboard/billing">
          <Icons.credit className="mr-2 size-4" aria-hidden="true" />
          Billing
          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
        </Link>
      </DropdownMenuItem> */}
    </DropdownMenuGroup>
  );
}
