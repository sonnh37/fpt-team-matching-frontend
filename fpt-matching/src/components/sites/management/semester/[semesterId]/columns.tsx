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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Semester } from "@/types/semester";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
export const columns: ColumnDef<Semester>[] = [
  {
    accessorKey: "semesterCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
  },
  {
    accessorKey: "semesterName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },

  {
    accessorKey: "isDeleted",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Is Deleted" />
    ),
    cell: ({ row }) => {
      const isDeleted = row.getValue("isDeleted") as boolean;
      if (!isDeleted) {
        return (
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/smart-thrive.appspot.com/o/Blog%2Fcheck.png?alt=media&token=1bdb7751-4bdc-4af1-b6e1-9b758df3a3d5"
            width={500}
            height={500}
            alt="Gallery Icon"
            className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
          />
        );
      }
      return (
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/smart-thrive.appspot.com/o/Blog%2Funcheck.png?alt=media&token=3b2b94d3-1c59-4a96-b4c6-312033d868b1"
          width={500}
          height={500}
          alt="Gallery Icon"
          className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
        />
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];

interface ActionsProps {
  row: Row<Semester>;
}
