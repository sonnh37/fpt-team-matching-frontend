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
import { formatDate } from "@/lib/utils";
import { StageIdea } from "@/types/stage-idea";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
export const columns: ColumnDef<StageIdea>[] = [
  {
    accessorKey: "stageNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stage number" />
    ),
  },
  {
    accessorKey: "stageideaName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="StartDate" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("startDate"));
      return formatDate(date)
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="EndDate" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("endDate"));
      return formatDate(date)
    },
  },

  {
    accessorKey: "resultDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ResultDate" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("resultDate"));
      return formatDate(date)
    },
  },

  {
    accessorKey: "isDeleted",
    // header: ({ column }) => (
    //   <DataTableColumnHeader column={column} title="Is Deleted" />
    // ),
    // cell: ({ row }) => {
    //   const isDeleted = row.getValue("isDeleted") as boolean;
    //   if (!isDeleted) {
    //     return (
    //       <Image
    //         src="https://firebasestorage.googleapis.com/v0/b/smart-thrive.appspot.com/o/Blog%2Fcheck.png?alt=media&token=1bdb7751-4bdc-4af1-b6e1-9b758df3a3d5"
    //         width={500}
    //         height={500}
    //         alt="Gallery Icon"
    //         className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
    //       />
    //     );
    //   }
    //   return (
    //     <Image
    //       src="https://firebasestorage.googleapis.com/v0/b/smart-thrive.appspot.com/o/Blog%2Funcheck.png?alt=media&token=3b2b94d3-1c59-4a96-b4c6-312033d868b1"
    //       width={500}
    //       height={500}
    //       alt="Gallery Icon"
    //       className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
    //     />
    //   );
    // },
    header: () => null, // Không hiển thị header
    cell: () => null,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];

interface ActionsProps {
  row: Row<StageIdea>;
}
