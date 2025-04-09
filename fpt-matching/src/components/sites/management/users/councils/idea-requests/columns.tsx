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
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
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
    accessorKey: "ideaRequestOfReviewers",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Idea Request Pending" />
    ),
    cell: ({ row }) => {
      const countIdeaRequestOfReviewers = row.original.ideaRequestOfReviewers?.length;

      return <TypographyP>{countIdeaRequestOfReviewers}</TypographyP>;
    },
  }
];

interface ActionsProps {
  row: Row<User>;
}
