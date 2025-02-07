import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Const } from "@/lib/constants/const";
import Link from "next/link";
import { ModeToggle } from "@/components/_common/mode-toggle";
import { AuthDropdown } from "@/components/_common/auth-dropdown";
import { ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";
import { User } from "@/types/user";

interface MainNavProps {
  user?: User | null;
}

export function MainNav({ user = null }: MainNavProps) {
  return (
    <div className="hidden lg:flex justify-between w-full mx-auto gap-6 text-lg">
      <div className="flex gap-4">
        <Dropdown label="Diễn đàn">
          <DropdownItem href={"#"} title="Instagram" />
          <DropdownItem href={"#"} title="Bài mới" />
          <DropdownItem href={"#"} title="Tìm trong diễn đàn" />
        </Dropdown>

        <Dropdown label="Có gì mới">
          <DropdownItem
            href={"#"}
            title="Featured content"
          />
          <DropdownItem href={"#"} title="Bài mới" />
          <DropdownItem href={"#"} title="Ảnh mới" />
        </Dropdown>

        <Dropdown label="Học tập">
          <DropdownItem href={"#"} title="Thư viện ảnh" />
        </Dropdown>

        <Dropdown label="Danh hiệu">
          <DropdownItem href={"#"} title="Thành viên" />
          <DropdownItem
            href={"#"}
            title="Người đang truy cập"
          />
        </Dropdown>

        <Link
          href="/shop"
          className="text-orange-100 uppercase hover:underline"
        >
          Shop
        </Link>
      </div>

      <nav className="hidden lg:flex items-center space-x-4 bg-orange-600 px-4">
        <ModeToggle />
        <AuthDropdown user={user} />
      </nav>
    </div>
  );
}

interface DropdownProps {
  label: string;
  children: ReactNode;
}

function Dropdown({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
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

        {/* Dropdown menu phải sát với trigger */}
        <DropdownMenuContent
          align="start"
          sideOffset={0}
          className={`absolute left-0 top-full w-48 transition-opacity ${
            open
              ? "opacity-100 pointer-events-none"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {children}
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
}

// interface DropdownProps {
//   label: string;
//   children: ReactNode;
// }

// function Dropdown({ label, children }: DropdownProps) {
//   const [open, setOpen] = useState(false);

//   return (
//     <DropdownMenu open={open} onOpenChange={setOpen}>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="ghost"
//           className="text-orange-100 uppercase data-[state=open]:bg-accent"
//           onMouseEnter={() => setOpen(true)}
//           onMouseLeave={() => setOpen(false)}
//         >
//           {label}
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent
//         align="start"
//         onMouseEnter={() => setOpen(true)}
//         onMouseLeave={() => setOpen(false)}
//       >
//         {children}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
interface DropdownItemProps {
  href: string;
  title: string;
}

function DropdownItem({ href, title }: DropdownItemProps) {
  return (
    <DropdownMenuItem asChild>
      <Link
        href={href}
        className="w-full text-left block py-2 px-4 hover:bg-accent"
      >
        {title}
      </Link>
    </DropdownMenuItem>
  );
}
