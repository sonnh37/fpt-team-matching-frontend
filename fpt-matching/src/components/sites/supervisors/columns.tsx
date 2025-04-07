"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { User } from "@/types/user";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {IdeaStatus} from "@/types/enums/idea";
import {Badge} from "@/components/ui/badge";
import {Department} from "@/types/enums/user";
import {TypographyH4} from "@/components/_common/typography/typography-h4";
export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Code" />
    ),
  },

  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full name" />
    ),
    cell: ({ row }) => {
      const model = row.original;
      const lastName = model.firstName;
      const firstName = model.lastName;
      return (
        <div>
          <TypographyP>{lastName + " " + firstName}</TypographyP>
        </div>
      );
    },
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
      const status = row.getValue("department") as Department | undefined;
      const statusText = status !== undefined ? Department[status] : "Unknown";

      return <TypographyP>{statusText}</TypographyP>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];

