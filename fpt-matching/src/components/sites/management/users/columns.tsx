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
import Link from "next/link";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "avatar",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Avatar" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      const initials = `${user.firstName?.charAt(0) ?? ""}${
        user.lastName?.charAt(0) ?? ""
      }`.toUpperCase();
      
      return (
        <Avatar className="size-10">
          <AvatarImage
            src={user.avatar?.trim() || undefined}
            alt={user.username ?? ""}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <AvatarFallback className="rounded-md">{initials}</AvatarFallback>
        </Avatar>
      );
    },
    size: 70,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const email = row.original.email ?? "Unknown";
      return <TypographyP className="truncate max-w-[180px]">{email}</TypographyP>;
    },
    size: 200,
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
    size: 120,
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
    size: 120,
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
    size: 120,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const roles = row.original.userXRoles?.map(
        (userXRole: UserXRole) => userXRole.role?.roleName
      ).filter(Boolean);
      
      return (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {roles?.map((role, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
            >
              {role}
            </span>
          )) || "N/A"}
        </div>
      );
    },
    size: 200,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id || "")}
            >
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/management/users/assignments/roles/${user.id}`}>
                Assign Roles
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 60,
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    size: 100,
  },
  {
    accessorKey: "dob",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date of Birth" />
    ),
    cell: ({ row }) => formatDate(new Date(row.getValue("dob"))),
    size: 120,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    size: 120,
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
    size: 200,
  },
  {
    accessorKey: "department",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
    cell: ({ row }) => Department[row.original.department ?? 0] || "N/A",
    size: 150,
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
    size: 100,
  },
  {
    accessorKey: "semesterId",
    header: () => null,
    cell: () => null,
    enableHiding: true,
  },
];