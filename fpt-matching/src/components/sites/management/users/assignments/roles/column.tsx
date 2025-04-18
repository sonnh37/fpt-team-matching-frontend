"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";
import { Department } from "@/types/enums/user";
import { User } from "@/types/user";
import { UserXRole } from "@/types/user-x-role";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "avatar",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Avatar" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      const initials = `${user.firstName?.toUpperCase().charAt(0) ?? ""}${
        user.lastName?.toUpperCase().charAt(0) ?? ""
      }`;
      return (
        <Button variant="ghost" className={"size-10 focus-visible:ring-0"}>
          <Avatar className="size-10 p-0 m-0">
            <AvatarImage
              src={
                user.avatar && user.avatar.trim() !== ""
                  ? user.avatar
                  : undefined
              }
              alt={user.username ?? ""}
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <AvatarFallback className="rounded-md">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const email = row.original.email ?? "Unknown"; 
      const id = row.original.id ?? "#";

      return (
        <Button variant="link" className="p-0 m-0" asChild>
          <Link href={`/management/users/assignments/roles/${id}`}>{email}</Link>
        </Button> 
      );
    },
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
  },
  {
    accessorKey: "dob",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date of Birth" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("dob"));
      return formatDate(date);
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => (
      <TypographyP className="line-clamp-1 max-w-[200px]">
        {row.getValue("address")}
      </TypographyP>
    ),
  },
  {
    accessorKey: "department",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
    cell: ({ row }) => {
      const department: Department = row.getValue("department");
      return Department[department] || "N/A";
    },
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const roles = row.original.userXRoles?.map(
        (userXRole: UserXRole) => userXRole.role?.roleName
      );

      return <TypographyP>{roles?.join(", ") || "N/A"}</TypographyP>;
    },
  },
  {
    accessorKey: "isDeleted",
    header: ({ column }) => null,
    cell: ({ row }) => null,
  },
];

interface ActionsProps {
  row: Row<User>;
}
