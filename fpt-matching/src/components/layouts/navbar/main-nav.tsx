"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "@/components/_common/mode-toggle";
import { AuthDropdown } from "@/components/_common/auth-dropdown";
import { ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";
import { User } from "@/types/user";
import { usePathname } from "next/navigation";
import AutoBreadcrumb from "@/components/_common/breadcrumbs";
import DynamicBreadcrumbs from "@/components/_common/breadcrumbs/dynamic-breadcrumbs";
import { Search } from "@/components/_common/search";

interface MainNavProps {
  user?: User | null;
}

export function MainNav({ user = null }: MainNavProps) {
  return (
    <div className="flex flex-col w-full">
      <div className="hidden lg:flex overflow-hidden justify-between w-full mx-auto gap-6 text-lg">
        <div className="flex gap-4">
          <LinkItem href="/" title="Trang chủ" />
          <Dropdown label="Diễn đàn">
            <DropdownItem href={"#"} title="Instagram" />
            <DropdownItem href={"#"} title="Bài mới" />
            <DropdownItem href={"#"} title="Tìm trong diễn đàn" />
          </Dropdown>

          <Dropdown label="Có gì mới">
            <DropdownItem href={"#"} title="Featured content" />
            <DropdownItem href={"#"} title="Bài mới" />
            <DropdownItem href={"#"} title="Ảnh mới" />
          </Dropdown>

          <Dropdown label="Học tập">
            <DropdownItem href={"#"} title="Thư viện ảnh" />
          </Dropdown>

          <Dropdown label="Danh hiệu">
            <DropdownItem href={"#"} title="Thành viên" />
            <DropdownItem href={"#"} title="Người đang truy cập" />
          </Dropdown>

          <LinkItem href="#" title="Shop" />
        </div>

        <nav className="hidden lg:flex items-center bg-orange-400">
          {/* <ModeToggle /> */}
          <Search />
          <AuthDropdown user={user} />
        </nav>
      </div>
    </div>
  );
}

interface DropdownProps {
  label: string;
  children: ReactNode;
}

function Dropdown({ label, children }: DropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="text-orange-100 uppercase data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
          >
            {label}
            <ChevronDown
              className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" sideOffset={0}>
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

interface DropdownItemProps {
  href: string;
  title: string;
}

function DropdownItem({ href, title }: DropdownItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <DropdownMenuItem asChild>
      <Link
        href={href}
        className={`w-full text-left block py-2 px-4 hover:bg-accent ${
          isActive ? "bg-accent text-accent-foreground" : ""
        }`}
      >
        {title}
      </Link>
    </DropdownMenuItem>
  );
}
function LinkItem({ href, title }: DropdownItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Button
      asChild
      variant="ghost"
      className={`text-orange-100 uppercase data-[state=open]:bg-accent data-[state=open]:text-accent-foreground ${
        isActive ? "bg-accent text-accent-foreground" : ""
      }`}
    >
      <Link href={href}>{title}</Link>
    </Button>
  );
}
