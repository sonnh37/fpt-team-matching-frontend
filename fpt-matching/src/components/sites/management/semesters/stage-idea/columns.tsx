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
import { StageTopic } from "@/types/stage-topic";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
export const columns: ColumnDef<StageTopic>[] = [
  {
    accessorKey: "stageNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Đợt" />
    ),
  },
  {
    accessorKey: "numberReviewer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Số lượng người đánh giá" />
    ),
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày bắt đầu" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("startDate"));
      return formatDate(date)
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày kết thúc" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("endDate"));
      return formatDate(date)
    },
  },
  {
    accessorKey: "resultDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày kết quả" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("resultDate"));
      return formatDate(date)
    },
  },

];

interface ActionsProps {
  row: Row<StageTopic>;
}
