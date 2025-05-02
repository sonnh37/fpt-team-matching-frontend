"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import { DeleteBaseEntitysDialog } from "@/components/_common/delete-dialog-generic";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RootState } from "@/lib/redux/store";
import { formatDate } from "@/lib/utils";
import { ideaVersionRequestService } from "@/services/idea-version-request-service";
import { IdeaVersionRequestStatus } from "@/types/enums/idea-version-request";
import { IdeaVersionRequest } from "@/types/idea-version-request";
import { User } from "@/types/user";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Eye, ListChecks, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CiFolderOn, CiFolderOff } from "react-icons/ci";
import { useSelector } from "react-redux";
import { Idea } from "@/types/idea";
import { IdeaDetailForm } from "../../../detail";
import Link from "next/link";
import { useSelectorUser } from "@/hooks/use-auth";

export const columns: ColumnDef<Idea>[] = [
  {
    accessorKey: "teamCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã nhóm" />
    ),
    cell: ({ row }) => {
      const idea = row.original;
      const highestVersion =
        idea.ideaVersions.length > 0
          ? idea.ideaVersions.reduce((prev, current) =>
              (prev.version ?? 0) > (current.version ?? 0) ? prev : current
            )
          : undefined;
      return highestVersion?.topic?.project?.teamCode || "-";
    },
  },
  {
    accessorKey: "topicCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã topic" />
    ),
    cell: ({ row }) => {
      const idea = row.original;
      const highestVersion =
        idea.ideaVersions.length > 0
          ? idea.ideaVersions.reduce((prev, current) =>
              (prev.version ?? 0) > (current.version ?? 0) ? prev : current
            )
          : undefined;
      return highestVersion?.topic?.topicCode || "-";
    },
  },
  // {
  //   accessorKey: "vietNamName",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Tên đề tài (VN)" />
  //   ),
  //   cell: ({ row }) => {
  //     const idea = row.original;
  //     const highestVersion = idea.ideaVersions.length > 0
  //       ? idea.ideaVersions.reduce((prev, current) =>
  //           (prev.version ?? 0) > (current.version ?? 0) ? prev : current
  //         )
  //       : undefined;
  //     return highestVersion?.vietNamName || "-";
  //   },
  // },
  // {
  //   accessorKey: "englishName",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Tên đề tài (EN)" />
  //   ),
  //   cell: ({ row }) => {
  //     const idea = row.original;
  //     const highestVersion = idea.ideaVersions.length > 0
  //       ? idea.ideaVersions.reduce((prev, current) =>
  //           (prev.version ?? 0) > (current.version ?? 0) ? prev : current
  //         )
  //       : undefined;
  //     return highestVersion?.englishName || "-";
  //   },
  // },
  {
    accessorKey: "version",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phiên bản" />
    ),
    cell: ({ row }) => {
      const idea = row.original;
      const highestVersion =
        idea.ideaVersions.length > 0
          ? idea.ideaVersions.reduce((prev, current) =>
              (prev.version ?? 0) > (current.version ?? 0) ? prev : current
            )
          : undefined;
      return highestVersion ? `v${highestVersion.version}` : "-";
    },
  },
  // {
  //   accessorKey: "enterpriseName",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Doanh nghiệp" />
  //   ),
  //   cell: ({ row }) => {
  //     const idea = row.original;
  //     const highestVersion = idea.ideaVersions.length > 0
  //       ? idea.ideaVersions.reduce((prev, current) =>
  //           (prev.version ?? 0) > (current.version ?? 0) ? prev : current
  //         )
  //       : undefined;
  //     return highestVersion?.enterpriseName || "-";
  //   },
  // },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as IdeaVersionRequestStatus;
      const statusText = IdeaVersionRequestStatus[status];

      let badgeVariant:
        | "secondary"
        | "destructive"
        | "default"
        | "outline"
        | null = "default";

      switch (status) {
        case IdeaVersionRequestStatus.Approved:
          badgeVariant = "default";
          break;
        default:
          badgeVariant = "outline";
      }

      return <Badge variant={badgeVariant}>{statusText}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "actions",
    header: "Tùy chọn",
    cell: ({ row }) => {
      return <Actions row={row} />;
    },
  },
];

interface ActionsProps {
  row: Row<Idea>;
}

const Actions: React.FC<ActionsProps> = ({ row }) => {
  const idea = row.original;

  const user = useSelectorUser();
  if (!user) return;

  const highestVersion =
    idea.ideaVersions.length > 0
      ? idea.ideaVersions.reduce((prev, current) =>
          (prev.version ?? 0) > (current.version ?? 0) ? prev : current
        )
      : undefined;

 
  return (
    <div className="flex flex-row gap-2">
      {/* Nút xem nhanh trong dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button size="icon" variant="outline">
            <Eye className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          {idea && <IdeaDetailForm ideaId={idea.id} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};
